/**
 * MedBhasha Shared Contracts and Data Models
 * Seam between Part 1 (Patient App) and Part 2 (Trust Layer)
 * Defined in ref/02-contracts-and-data-model.md
 */

export type ConfirmStatus = 'draft' | 'confirmed';
export type MedicineSource = 'scan_rx' | 'scan_strip' | 'manual';
export type FrequencyType = 'daily_times' | 'every_n_hours' | 'weekly_days' | 'as_needed';
export type FoodRelation = 'before' | 'after' | 'with' | 'any' | 'unspecified';
export type DoseStatus = 'pending' | 'due' | 'taken' | 'missed' | 'postponed' | 'skipped';
export type ExpStatus = 'valid' | 'near_expiry' | 'expired' | 'unknown';
export type VerificationStatus = 'unverified' | 'in_review' | 'verified' | 'rejected' | 'stale';
export type ContentKind = 'instruction_template' | 'medicine_info' | 'safety_copy' | 'ui_string';
export type EscalationState = 'scheduled' | 'cancelled' | 'sent' | 'failed';

export interface Medicine {
  id: string;
  display_name: string;
  strength?: string;
  form?: string; // tablet, capsule, syrup, drops, injection
  source: MedicineSource;
  confirm_status: ConfirmStatus;
  created_at: number;
  updated_at: number;
}

export interface Prescription {
  id: string;
  image_path?: string; // local encrypted or base64 data
  captured_at: number;
  raw_text?: string;
  extraction_json?: string; // fields + per-field confidence
  confirm_status: ConfirmStatus;
  review_request_id?: string;
  consent_cloud_at?: number; // null = never sent off device
}

export interface Schedule {
  id: string;
  medicine_id: string;
  frequency_type: FrequencyType;
  times_json: string; // JSON array of wall-clock "08:00", "20:00"
  repeat_days?: string[]; // Optional short weekday names for weekly schedules
  tz_id: string;
  food_relation: FoodRelation;
  qty_text: string; // e.g., "1", "1/2" as written
  start_date: string;
  end_date?: string;
  confirm_status: ConfirmStatus;
  confirmed_at?: number;
}

export interface DoseEvent {
  id: string;
  schedule_id: string;
  medicine_id: string;
  medicine_name: string;
  strength?: string;
  due_at: number; // epoch ms
  status: DoseStatus;
  acted_at?: number;
  postponed_until?: number;
  food_relation: FoodRelation;
  qty_text: string;
}

export interface ExpiryRecord {
  id: string;
  medicine_id: string;
  mfg_date?: string; // ISO yyyy-mm or yyyy-mm-dd
  exp_date?: string; // ISO yyyy-mm or yyyy-mm-dd
  batch_no?: string;
  exp_status: ExpStatus;
  ocr_confidence?: number;
  user_confirmed: number; // 0 or 1
  raw_text?: string;
}

export interface ContentItem {
  id: string; // stable: kind:key:locale
  kind: ContentKind;
  key: string; // e.g. instr.take.after_food
  locale: string; // en, te
  body_text: string;
  audio_url?: string;
  audio_sha256?: string;
  source_text_sha256: string; // hash of the English source
  content_sha256: string; // hash of canonical(key, locale, body_text, source_text_sha256, audio_sha256)
  verification_status: VerificationStatus;
  reviewer_id?: string;
  reviewed_at?: number;
  bundle_version?: string;
  signature?: string; // from bundle; null for unverified
}

export interface AckLog {
  id: string;
  content_item_id: string;
  acknowledged_at: number;
  action: 'played_anyway' | 'chose_english' | 'asked_pharmacist' | 'cancelled';
}

export interface Guardian {
  id: string;
  name: string;
  phone_e164: string;
  consent_at: number;
  wait_minutes: number;
  active: number; // 0 or 1
  include_medicine_names: boolean; // default false per S7
}

export interface Escalation {
  id: string;
  dose_event_id: string;
  state: EscalationState;
  scheduled_at: number;
  sent_at?: number;
  cancelled_at?: number;
  message_preview: string;
  phone: string;
}

export interface SyncQueueItem {
  id: string;
  op: 'review_request' | 'escalation' | 'cancel_escalation' | 'audit_event';
  payload_json: string;
  attempts: number;
  next_try_at: number;
  created_at: number;
}

export interface BundleItem {
  key: string;
  kind: ContentKind;
  locale: string;
  text: string;
  audio?: {
    url: string;
    sha256: string;
  };
  source_text_sha256: string;
  content_sha256: string;
  status: VerificationStatus;
  review?: {
    reviewer_id: string;
    credential_type: string;
    reviewed_at: string;
    comment?: string;
  };
}

export interface SignedBundle {
  bundle_version: string;
  locale: string;
  issued_at: string;
  items: BundleItem[];
  signature: {
    alg: 'ed25519';
    key_id: string;
    public_key: string;
    sig: string; // base64
  };
}

export interface ExtractedMedicineDraft {
  temp_id: string;
  name: string;
  name_confidence: number;
  strength: string;
  strength_confidence: number;
  form: string;
  dose_qty: string;
  dose_confidence: number;
  frequency: FrequencyType;
  timings: string[]; // ["08:00", "20:00"]
  timings_confidence: number;
  food_relation: FoodRelation;
  food_confidence: number;
  duration_days: number;
  duration_confidence: number;
  is_unclear: boolean; // true if any field < threshold (e.g. 0.75)
  unclear_reason?: string;
}

export interface ExtractionResult {
  prescription_id: string;
  confidence_overall: number;
  medicines: ExtractedMedicineDraft[];
  raw_text: string;
  source: 'on_device_mock' | 'cloud_ai';
}

export interface ReviewRequest {
  id: string;
  type: 'prescription' | 'content_item';
  patient_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  created_at: number;
  data: {
    prescription_id?: string;
    image_url?: string;
    extracted_fields?: ExtractedMedicineDraft[];
    content_item_key?: string;
    locale?: string;
    source_english?: string;
    proposed_translation?: string;
    sample_renderings?: string[];
  };
  reviewer_id?: string;
  reviewer_name?: string;
  credential_type?: string;
  reviewed_at?: number;
  comment?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  actor_id: string;
  actor_role: 'system' | 'patient' | 'pharmacist' | 'admin';
  action: string;
  target_id: string;
  target_type: 'content_item' | 'review_request' | 'bundle' | 'escalation' | 'dose';
  before_state?: string;
  after_state?: string;
  content_sha256?: string;
  comment?: string;
}

export interface CuratedMedicineInfo {
  medicine_id: string;
  name: string;
  generic_name: string;
  category: string;
  simple_uses: string;
  simple_uses_te: string;
  common_side_effects: string[];
  common_side_effects_te: string[];
  precautions: string;
  precautions_te: string;
  source_name: string;
  source_url: string;
  retrieved_at: string;
  is_verified: boolean;
}
