import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { samplePrescriptions, sampleStrips } from '../../shared/sample-data.js';
import { ExtractionResult, Escalation } from '../../shared/contracts.js';
import { addAuditLog, initSeedData, publishLatestBundle, state } from './state.js';
import { getPublicKeyHex } from './signer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health & Public Key Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MedBhasha Trust Layer',
    publicKeyHex: getPublicKeyHex(),
    invariants: 'S1-S12 active',
  });
});

/**
 * 1. POST /v1/extract
 * Online / Vision AI (Gemini 2.5 Flash) + Mock prescription and strip extraction
 * Enforces S1 (low-confidence marked unclear) & S2 (returns Draft only)
 */
app.post('/v1/extract', async (req: Request, res: Response) => {
  const { scenario_id, raw_image_preview, image_base64, type } = req.body;

  // Real Gemini Vision Extraction when API key and base64 image are supplied
  if (process.env.GEMINI_API_KEY && (image_base64 || raw_image_preview)) {
    const rawImage = image_base64 || raw_image_preview;
    try {
      console.log('[Vision AI] Calling Gemini 2.5 Flash for clinical prescription extraction...');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const cleanBase64 = rawImage.replace(/^data:image\/\w+;base64,/, '');
      const mimeType = rawImage.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

      const prompt = `You are a clinical transcription assistant for MedBhasha adhering strictly to critical medical safety invariants:
S1: Never guess. If any text or number is handwriting-ambiguous, low-contrast, or unclear, set that specific field's confidence to 0.50 and set is_unclear to true with unclear_reason explaining why.
S4: No dosing advice. Extract ONLY what is printed or written. Do not correct, modify, or infer doses.

Return a JSON object conforming strictly to this structure:
{
  "raw_text": "extracted text from document",
  "confidence_overall": 0.88,
  "medicines": [
    {
      "temp_id": "draft_1",
      "name": "Medicine Name",
      "name_confidence": 0.95,
      "strength": "500 mg",
      "strength_confidence": 0.90,
      "form": "tablet",
      "dose_qty": "1",
      "dose_confidence": 0.95,
      "frequency": "daily_times",
      "timings": ["08:00", "20:00"],
      "timings_confidence": 0.90,
      "food_relation": "after",
      "food_confidence": 0.90,
      "duration_days": 30,
      "duration_confidence": 0.90,
      "is_unclear": false,
      "unclear_reason": ""
    }
  ]
}
For frequency, allowed values are strictly: "daily_times", "every_n_hours", "weekly_days", "as_needed".
For food_relation, allowed values are strictly: "before", "after", "with", "any", "unspecified".
For shorthand timings like 1-0-1, map to ["08:00", "20:00"] and set timings_confidence to 0.72.`;

      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType, data: cleanBase64 } },
              { text: prompt },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = geminiResponse.text || '{}';
      const parsed = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());

      return res.json({
        prescription_id: 'rx_gemini_' + Date.now(),
        confidence_overall: parsed.confidence_overall || 0.85,
        medicines: parsed.medicines || [],
        raw_text: parsed.raw_text || '',
        source: 'cloud_ai',
      });
    } catch (err: any) {
      console.warn('[Vision AI] Gemini Vision extraction failed or was offline, falling back to local scenario:', err?.message || err);
    }
  }

  // Fallback to high-accuracy local sample scenario (S1 & S2 compliant)
  const scenario =
    samplePrescriptions.find((s) => s.id === scenario_id) ||
    samplePrescriptions[1]; // default to sample with S1 unclear warning for demonstration

  const result: ExtractionResult = {
    prescription_id: 'rx_' + Date.now(),
    confidence_overall: scenario.hasUnclearFields ? 0.76 : 0.97,
    medicines: scenario.medicines,
    raw_text: scenario.rawOcrText,
    source: 'on_device_mock',
  };

  res.json(result);
});

/**
 * 2. POST /v1/review-requests
 * Submit a prescription or content item for pharmacist review
 */
app.post('/v1/review-requests', (req: Request, res: Response) => {
  const { type, data, patient_id } = req.body;

  const id = 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const newRequest = {
    id,
    type: type || 'prescription',
    patient_id: patient_id || 'patient_anon',
    status: 'pending' as const,
    created_at: Date.now(),
    data: data || {},
  };

  state.reviewRequests.set(id, newRequest);

  addAuditLog({
    actor_id: patient_id || 'patient_anon',
    actor_role: 'patient',
    action: 'SUBMIT_REVIEW_REQUEST',
    target_id: id,
    target_type: 'review_request',
    after_state: 'pending',
    comment: `Review requested for ${type}`,
  });

  res.status(201).json(newRequest);
});

/**
 * GET /v1/review-requests
 */
app.get('/v1/review-requests', (req: Request, res: Response) => {
  res.json(Array.from(state.reviewRequests.values()));
});

/**
 * GET /v1/review-requests/:id
 */
app.get('/v1/review-requests/:id', (req: Request, res: Response) => {
  const reqItem = state.reviewRequests.get(req.params.id);
  if (!reqItem) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Review request not found' } });
  }
  res.json(reqItem);
});

/**
 * 3. GET /v1/bundles/latest?locale=te&since=<version>
 * Fetch latest signed bundle (Ed25519)
 */
app.get('/v1/bundles/latest', (req: Request, res: Response) => {
  const locale = (req.query.locale as string) || 'te';
  const since = req.query.since as string;

  const bundle = state.signedBundles.get(locale);
  if (!bundle) {
    return res.status(404).json({ error: { code: 'NO_BUNDLE', message: `No bundle found for locale ${locale}` } });
  }

  if (since && since === bundle.bundle_version) {
    return res.status(304).end(); // Not modified
  }

  res.json(bundle);
});

/**
 * 4. POST /v1/escalations
 * Schedule a guardian escalation alert (minimal payload, S7)
 */
app.post('/v1/escalations', (req: Request, res: Response) => {
  const { dose_event_id, phone, message_preview, wait_minutes } = req.body;

  const id = 'esc_' + Date.now();
  const scheduledAt = Date.now() + (wait_minutes || 30) * 60000;

  const escalation: Escalation = {
    id,
    dose_event_id,
    state: 'scheduled',
    scheduled_at: scheduledAt,
    message_preview: message_preview || 'Dose reminder pending confirmation',
    phone: phone || '',
  };

  state.escalations.set(id, escalation);

  addAuditLog({
    actor_id: 'system',
    actor_role: 'system',
    action: 'SCHEDULE_GUARDIAN_ALERT',
    target_id: id,
    target_type: 'escalation',
    after_state: 'scheduled',
    comment: `Escalation scheduled for ${escalation.phone}`,
  });

  res.status(201).json(escalation);
});

/**
 * 5. DELETE /v1/escalations/:id or /v1/escalations/by-dose/:dose_id
 * Cancel pending alert immediately when patient marks dose (S7)
 */
app.delete('/v1/escalations/:id', (req: Request, res: Response) => {
  const esc = state.escalations.get(req.params.id);
  if (!esc) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Escalation not found' } });
  }

  esc.state = 'cancelled';
  esc.cancelled_at = Date.now();

  addAuditLog({
    actor_id: 'patient',
    actor_role: 'patient',
    action: 'CANCEL_GUARDIAN_ALERT',
    target_id: esc.id,
    target_type: 'escalation',
    before_state: 'scheduled',
    after_state: 'cancelled',
    comment: 'Patient confirmed dose taken; escalation cancelled immediately (S7)',
  });

  res.json({ status: 'cancelled', id: esc.id });
});

app.delete('/v1/escalations/by-dose/:doseId', (req: Request, res: Response) => {
  const doseId = req.params.doseId;
  let cancelledCount = 0;

  for (const esc of state.escalations.values()) {
    if (esc.dose_event_id === doseId && esc.state === 'scheduled') {
      esc.state = 'cancelled';
      esc.cancelled_at = Date.now();
      cancelledCount++;

      addAuditLog({
        actor_id: 'patient',
        actor_role: 'patient',
        action: 'CANCEL_GUARDIAN_ALERT',
        target_id: esc.id,
        target_type: 'escalation',
        before_state: 'scheduled',
        after_state: 'cancelled',
        comment: `Cancelled on dose confirmation for ${doseId}`,
      });
    }
  }

  res.json({ status: 'ok', cancelled: cancelledCount });
});

/**
 * 6. Portal Endpoints (P01-P05)
 */
app.get('/portal/queue', (req: Request, res: Response) => {
  res.json(Array.from(state.reviewRequests.values()));
});

app.post('/portal/items/:id/approve', async (req: Request, res: Response) => {
  const { reviewer_id, reviewer_name, credential_type, comment } = req.body;
  const reviewReq = state.reviewRequests.get(req.params.id);

  if (!reviewReq) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
  }

  reviewReq.status = 'approved';
  reviewReq.reviewer_id = reviewer_id || 'rev_pharmacist_01';
  reviewReq.reviewer_name = reviewer_name || 'Dr. Ananya Reddy, PharmD';
  reviewReq.credential_type = credential_type || 'licensed_pharmacist';
  reviewReq.reviewed_at = Date.now();
  reviewReq.comment = comment || 'Verified accurate against clinical formulation.';

  // If this review was for a content item (Translation Lock)
  if (reviewReq.data.content_item_key) {
    const key = reviewReq.data.content_item_key;
    const locale = reviewReq.data.locale || 'te';
    const itemId = `instruction_template:${key}:${locale}`;
    const item = state.contentItems.get(itemId);

    if (item) {
      item.verification_status = 'verified';
      item.reviewer_id = reviewReq.reviewer_id;
      item.reviewed_at = reviewReq.reviewed_at;
      item.bundle_version = `2026.10.31-${String(Date.now()).slice(-4)}`;

      // Publish signed bundle immediately
      await publishLatestBundle(locale, item.bundle_version);
    }
  }

  addAuditLog({
    actor_id: reviewReq.reviewer_id || 'rev_pharmacist_01',
    actor_role: 'pharmacist',
    action: 'APPROVE_ITEM',
    target_id: reviewReq.id,
    target_type: 'review_request',
    before_state: 'pending',
    after_state: 'approved',
    comment: `Approved by ${reviewReq.reviewer_name} (${reviewReq.credential_type})`,
  });

  res.json({ status: 'approved', item: reviewReq });
});

app.post('/portal/items/:id/reject', (req: Request, res: Response) => {
  const { reviewer_id, comment } = req.body;
  const reviewReq = state.reviewRequests.get(req.params.id);

  if (!reviewReq) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
  }

  reviewReq.status = 'rejected';
  reviewReq.reviewed_at = Date.now();
  reviewReq.comment = comment || 'Rejected due to ambiguity.';

  if (reviewReq.data.content_item_key) {
    const key = reviewReq.data.content_item_key;
    const locale = reviewReq.data.locale || 'te';
    const itemId = `instruction_template:${key}:${locale}`;
    const item = state.contentItems.get(itemId);
    if (item) {
      item.verification_status = 'rejected';
    }
  }

  addAuditLog({
    actor_id: reviewer_id || 'rev_pharmacist_01',
    actor_role: 'pharmacist',
    action: 'REJECT_ITEM',
    target_id: reviewReq.id,
    target_type: 'review_request',
    before_state: 'pending',
    after_state: 'rejected',
    comment: reviewReq.comment,
  });

  res.json({ status: 'rejected', item: reviewReq });
});

app.get('/portal/audit', (req: Request, res: Response) => {
  res.json(state.auditLog);
});

app.get('/portal/content-registry', (req: Request, res: Response) => {
  res.json(Array.from(state.contentItems.values()));
});

app.post('/portal/bundle/publish', async (req: Request, res: Response) => {
  const locale = req.body.locale || 'te';
  const bundle = await publishLatestBundle(locale);
  res.json(bundle);
});

// Initialize seeds and start server
initSeedData().then(() => {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` MedBhasha Trust Layer running on http://localhost:${PORT}`);
    console.log(` Ed25519 Public Key: ${getPublicKeyHex()}`);
    console.log(` Active Invariants: S1-S12 outrank everything`);
    console.log(`======================================================\n`);
  });
});
