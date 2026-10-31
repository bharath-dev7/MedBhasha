/**
 * S04 Prescription Review & Confirmation Screen
 * Strictly enforces Safety Invariants S1 & S2:
 * 1. Low confidence fields highlighted as unclear (S1)
 * 2. Unclear fields BLOCK confirmation until user inspects/edits them
 * 3. Nothing becomes confirmed until user explicitly confirms (S2)
 */

import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Stethoscope, Check, ArrowLeft, ZoomIn } from 'lucide-react';
import { ActionButton } from '../components/ActionButton';
import { ConfirmField } from '../components/ConfirmField';
import { StepHeader } from '../components/StepHeader';
import { ExtractedMedicineDraft } from '../../../shared/contracts';
import { SamplePrescriptionScenario } from '../../../shared/sample-data';
import { localDb } from '../db/localStore';

interface S04PrescriptionReviewProps {
  scenario: SamplePrescriptionScenario;
  onBack: () => void;
  onConfirmed: (confirmedMedicines: ExtractedMedicineDraft[]) => void;
  onAskPharmacist: (scenario: SamplePrescriptionScenario) => void;
}

export const S04_PrescriptionReview: React.FC<S04PrescriptionReviewProps> = ({
  scenario,
  onBack,
  onConfirmed,
  onAskPharmacist,
}) => {
  // Local editable draft medicines
  const [drafts, setDrafts] = useState<ExtractedMedicineDraft[]>(
    JSON.parse(JSON.stringify(scenario.medicines))
  );

  // Track which unclear fields have been verified by user
  const [unclearFieldsTouched, setUnclearFieldsTouched] = useState<Record<string, boolean>>({});

  // Check if any draft item still has an unaddressed unclear field
  const unaddressedUnclearCount = drafts.reduce((acc, draft) => {
    if (draft.is_unclear && !unclearFieldsTouched[draft.temp_id]) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const canConfirm = unaddressedUnclearCount === 0;

  const handleUpdateField = (tempId: string, field: keyof ExtractedMedicineDraft, newVal: any) => {
    setDrafts((prev) =>
      prev.map((d) => (d.temp_id === tempId ? { ...d, [field]: newVal } : d))
    );
    setUnclearFieldsTouched((prev) => ({ ...prev, [tempId]: true }));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-paper)',
        padding: '16px 16px 80px 16px',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >
      <StepHeader
        currentStep={2}
        totalSteps={5}
        title="మందులను సరిచూడండి (Check Medicines)"
        onBack={onBack}
      />

      {/* Prescription Crop Card */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '16px',
          borderRadius: 'var(--radius-panel)',
          border: '1.5px solid var(--color-line-soft)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <strong style={{ fontSize: 'calc(16px * var(--font-scale))', color: 'var(--color-ink)' }}>
            స్కాన్ చేసిన పత్రం (Scanned Document)
          </strong>
          <span
            style={{
              fontSize: 'calc(13px * var(--font-scale))',
              color: 'var(--color-quiet)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ZoomIn size={14} /> Tap to expand
          </span>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-paper)',
            padding: '12px',
            borderRadius: 'var(--radius-field)',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: 'var(--color-ink)',
            maxHeight: '120px',
            overflowY: 'auto',
            border: '1px solid var(--color-line-soft)',
          }}
        >
          {scenario.rawOcrText}
        </div>
      </div>

      {/* Safety Notice: S1 & S2 Invariant Banner */}
      {unaddressedUnclearCount > 0 && (
        <div
          role="alert"
          style={{
            backgroundColor: 'var(--color-caution-tint)',
            border: '2px solid var(--color-caution)',
            borderRadius: 'var(--radius-panel)',
            padding: '14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <AlertTriangle size={26} color="var(--color-caution)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--color-caution)', fontSize: 'calc(17px * var(--font-scale))' }}>
              సరిచూడవలసిన వివరాలు ఉన్నాయి (Items Require Verification)
            </strong>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: 'calc(15px * var(--font-scale))',
                color: 'var(--color-ink)',
              }}
            >
              చేతిరాత స్పష్టంగా లేని చోట పసుపు రంగుతో సూచించబడింది. మీరు సరిచూసే వరకు అలారాలు ప్రారంభించబడవు (S1 & S2).
            </p>
          </div>
        </div>
      )}

      {/* Extracted Medicines List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {drafts.map((draft, idx) => (
          <div
            key={draft.temp_id}
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-panel)',
              padding: '20px',
              border: draft.is_unclear && !unclearFieldsTouched[draft.temp_id]
                ? '2.5px solid var(--color-caution)'
                : '1.5px solid var(--color-line-soft)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span
                style={{
                  backgroundColor: 'var(--color-care-tint)',
                  color: 'var(--color-care)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 700,
                  fontSize: 'calc(14px * var(--font-scale))',
                }}
              >
                మందు #{idx + 1} (Medicine #{idx + 1})
              </span>

              {draft.is_unclear && !unclearFieldsTouched[draft.temp_id] ? (
                <span
                  style={{
                    color: 'var(--color-caution)',
                    fontWeight: 700,
                    fontSize: 'calc(14px * var(--font-scale))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertTriangle size={16} /> Needs verification
                </span>
              ) : (
                <span
                  style={{
                    color: 'var(--color-verified)',
                    fontWeight: 700,
                    fontSize: 'calc(14px * var(--font-scale))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Check size={16} /> Confirmed by you
                </span>
              )}
            </div>

            {/* Field 1: Medicine Name */}
            <ConfirmField
              label="మందు పేరు (Medicine Name)"
              value={draft.name}
              isUnclear={false}
              confidence={draft.name_confidence}
              options={['Metformin', 'Amlodipine', 'Paracetamol', 'Pantoprazole', 'Atorvastatin']}
              onValueChange={(val) => handleUpdateField(draft.temp_id, 'name', val)}
            />

            {/* Field 2: Strength */}
            <ConfirmField
              label="మోతాదు / బలం (Strength)"
              value={draft.strength}
              isUnclear={false}
              confidence={draft.strength_confidence}
              options={['500 mg', '650 mg', '40 mg', '5 mg', '10 mg']}
              onValueChange={(val) => handleUpdateField(draft.temp_id, 'strength', val)}
            />

            {/* Field 3: Dose Quantity (Potentially Unclear) */}
            <ConfirmField
              label="ఒక్కసారికి ఎన్ని మాత్రలు? (Dose Quantity)"
              value={draft.dose_qty + ' మాత్ర'}
              isUnclear={draft.is_unclear && draft.dose_confidence < 0.75}
              unclearReason={draft.unclear_reason}
              confidence={draft.dose_confidence}
              options={['1 మాత్ర', '1/2 మాత్ర', '2 మాత్రలు']}
              onValueChange={(val) => {
                const qtyOnly = val.replace(' మాత్ర', '').replace('లు', '').trim();
                handleUpdateField(draft.temp_id, 'dose_qty', qtyOnly);
              }}
            />

            {/* Field 4: Food Relation */}
            <ConfirmField
              label="ఆహార సంబంధం (Food Relation)"
              value={
                draft.food_relation === 'after'
                  ? 'భోజనం తర్వాత (After Food)'
                  : draft.food_relation === 'before'
                  ? 'భోజనం ముందు (Before Food)'
                  : 'భోజనంతో పాటు (With Food)'
              }
              isUnclear={false}
              confidence={draft.food_confidence}
              options={[
                'భోజనం తర్వాత (After Food)',
                'భోజనం ముందు (Before Food)',
                'భోజనంతో పాటు (With Food)',
              ]}
              onValueChange={(val) => {
                let relation: any = 'after';
                if (val.includes('ముందు')) relation = 'before';
                else if (val.includes('పాటు')) relation = 'with';
                handleUpdateField(draft.temp_id, 'food_relation', relation);
              }}
            />
          </div>
        ))}
      </div>

      {/* Bottom Fixed Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ActionButton
          variant="primary"
          disabled={!canConfirm}
          disabledReason={
            !canConfirm
              ? 'పసుపు రంగులో సూచించిన వివరాలను సరిచూసిన తర్వాత మాత్రమే నిర్ధారించగలరు (Check highlighted items first per S1)'
              : undefined
          }
          onClick={() => onConfirmed(drafts)}
          icon={<Check size={26} />}
        >
          మందులను నిర్ధారించండి (Confirm Medicines)
        </ActionButton>

        <ActionButton
          variant="secondary"
          onClick={() => onAskPharmacist(scenario)}
          icon={<Stethoscope size={22} />}
        >
          ఫార్మసిస్ట్ సహాయం కోరండి (Ask Pharmacist to Check)
        </ActionButton>
      </div>
    </div>
  );
};
