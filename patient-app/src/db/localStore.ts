/**
 * MedBhasha Local Storage & Database Engine
 * Implements ref/02-contracts-and-data-model.md (SQLite/Encrypted Store Model)
 * Works 100% offline (S6 Invariant)
 */

import {
  AckLog,
  ContentItem,
  DoseEvent,
  Escalation,
  ExpiryRecord,
  Guardian,
  Medicine,
  Prescription,
  Schedule,
  SyncQueueItem,
} from '../../../shared/contracts';
import { instructionTemplates } from '../../../shared/ux-copy';
import { computeItemContentSha256, sha256Hex } from '../../../shared/crypto-bundle';

export interface LocalDatabaseState {
  medicines: Medicine[];
  prescriptions: Prescription[];
  schedules: Schedule[];
  doseEvents: DoseEvent[];
  expiryRecords: ExpiryRecord[];
  contentItems: ContentItem[];
  ackLogs: AckLog[];
  guardians: Guardian[];
  escalations: Escalation[];
  syncQueue: SyncQueueItem[];
  settings: {
    locale: 'en' | 'te';
    voiceEnabled: boolean;
    fontScale: number; // 1.0 to 2.0
    offlineMode: boolean; // Simulator toggle
    installedBundleVersion: string;
    alarmSound: string;
    exactAlarmAllowed: boolean;
    batteryOptimizedExempt: boolean;
  };
}

const STORAGE_KEY = 'medbhasha_local_db_v1';

class LocalDatabase {
  private state: LocalDatabaseState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
    if (this.state.medicines.length === 0) {
      this.seedDefaultData();
    }
  }

  private loadState(): LocalDatabaseState {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          return JSON.parse(data);
        }
      }
    } catch (e) {
      console.warn('Failed to load local DB, initializing fresh:', e);
    }
    return this.getInitialState();
  }

  private getInitialState(): LocalDatabaseState {
    return {
      medicines: [],
      prescriptions: [],
      schedules: [],
      doseEvents: [],
      expiryRecords: [],
      contentItems: [],
      ackLogs: [],
      guardians: [
        {
          id: 'g_default',
          name: 'Ramesh (Son)',
          phone_e164: '+919876543210',
          consent_at: Date.now(),
          wait_minutes: 30,
          active: 1,
          include_medicine_names: false, // S7 Privacy by default
        },
      ],
      escalations: [],
      syncQueue: [],
      settings: {
        locale: 'en', // Default language English per user request, instant toggle to Telugu
        voiceEnabled: true,
        fontScale: 1.0,
        offlineMode: false,
        installedBundleVersion: '2026.10.31-001',
        alarmSound: 'Gentle Chime',
        exactAlarmAllowed: true,
        batteryOptimizedExempt: true,
      },
    };
  }

  private saveState() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
      this.notify();
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  public resetToDefaults() {
    this.state = this.getInitialState();
    this.seedDefaultData();
    this.saveState();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getState(): LocalDatabaseState {
    return this.state;
  }

  /**
   * Seeds demo data: 2 confirmed medicines (Metformin and Amlodipine),
   * upcoming doses for today's Day Arc, and initial ContentItems (with one UNVERIFIED Telugu item for demo)
   */
  public async seedDefaultData() {
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    this.state.contentItems = [];
    this.state.medicines = [];
    this.state.schedules = [];
    this.state.doseEvents = [];
    this.state.expiryRecords = [];
    this.state.escalations = [];

    // Seed Content Items (Templates)
    for (const tpl of instructionTemplates) {
      const enHash = await sha256Hex(tpl.sourceEn);
      
      // English items are verified
      const enSha = await computeItemContentSha256({
        key: tpl.key,
        locale: 'en',
        text: tpl.sourceEn,
        source_text_sha256: enHash,
      });

      this.state.contentItems.push({
        id: `instruction_template:${tpl.key}:en`,
        kind: 'instruction_template',
        key: tpl.key,
        locale: 'en',
        body_text: tpl.sourceEn,
        source_text_sha256: enHash,
        content_sha256: enSha,
        verification_status: 'verified',
        reviewer_id: 'rev_system',
        reviewed_at: now,
        bundle_version: '2026.10.31-001',
      });

      // Telugu items:
      // Note: 'instr.take.after_food' is deliberately UNVERIFIED initially to allow the user
      // to experience the Translation Lock gate and test the Pharmacist approval sync!
      const isFlagshipUnverified = tpl.key === 'instr.take.after_food';
      const teSha = await computeItemContentSha256({
        key: tpl.key,
        locale: 'te',
        text: tpl.templateTe,
        source_text_sha256: enHash,
      });

      this.state.contentItems.push({
        id: `instruction_template:${tpl.key}:te`,
        kind: 'instruction_template',
        key: tpl.key,
        locale: 'te',
        body_text: tpl.templateTe,
        source_text_sha256: enHash,
        content_sha256: teSha,
        verification_status: isFlagshipUnverified ? 'unverified' : 'verified',
        reviewer_id: isFlagshipUnverified ? undefined : 'rev_pharmacist_01',
        reviewed_at: isFlagshipUnverified ? undefined : now - 86400000,
        bundle_version: isFlagshipUnverified ? undefined : '2026.10.31-001',
      });
    }

    // Medicine 1: Metformin 500mg
    const med1: Medicine = {
      id: 'med_metformin',
      display_name: 'Metformin',
      strength: '500 mg',
      form: 'tablet',
      source: 'scan_rx',
      confirm_status: 'confirmed',
      created_at: now,
      updated_at: now,
    };

    // Schedule 1: Twice daily (Morning 08:00, Night 20:00)
    const sched1: Schedule = {
      id: 'sched_metformin',
      medicine_id: med1.id,
      frequency_type: 'daily_times',
      times_json: JSON.stringify(['08:00', '20:00']),
      tz_id: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      food_relation: 'after',
      qty_text: '1',
      start_date: today,
      confirm_status: 'confirmed',
      confirmed_at: now,
    };

    // Expiry for Metformin
    const exp1: ExpiryRecord = {
      id: 'exp_metformin',
      medicine_id: med1.id,
      mfg_date: '2026-02',
      exp_date: '2028-01',
      batch_no: 'B240981',
      exp_status: 'valid',
      ocr_confidence: 0.98,
      user_confirmed: 1,
    };

    // Medicine 2: Amlodipine 5mg
    const med2: Medicine = {
      id: 'med_amlodipine',
      display_name: 'Amlodipine',
      strength: '5 mg',
      form: 'tablet',
      source: 'manual',
      confirm_status: 'confirmed',
      created_at: now,
      updated_at: now,
    };

    const sched2: Schedule = {
      id: 'sched_amlodipine',
      medicine_id: med2.id,
      frequency_type: 'daily_times',
      times_json: JSON.stringify(['14:00']),
      tz_id: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      food_relation: 'after',
      qty_text: '1',
      start_date: today,
      confirm_status: 'confirmed',
      confirmed_at: now,
    };

    const exp2: ExpiryRecord = {
      id: 'exp_amlodipine',
      medicine_id: med2.id,
      mfg_date: '2025-01',
      exp_date: '2027-06',
      batch_no: 'AM7812',
      exp_status: 'valid',
      ocr_confidence: 0.95,
      user_confirmed: 1,
    };

    this.state.medicines = [med1, med2];
    this.state.schedules = [sched1, sched2];
    this.state.expiryRecords = [exp1, exp2];

    // Generate today's Dose Events for Day Arc
    this.generateTodayDoses();
    this.saveState();
  }

  /**
   * Generates rolling dose events for confirmed schedules
   * Draft schedules NEVER create dose events (S2 Invariant)
   */
  public generateTodayDoses() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Clear old pending doses for today
    this.state.doseEvents = this.state.doseEvents.filter(
      (d) => new Date(d.due_at).toISOString().split('T')[0] !== todayStr || d.status === 'taken'
    );

    for (const sched of this.state.schedules) {
      if (sched.confirm_status !== 'confirmed') continue; // S2 ENFORCEMENT
      const med = this.state.medicines.find((m) => m.id === sched.medicine_id);
      if (!med) continue;

      let times: string[] = [];
      try {
        times = JSON.parse(sched.times_json);
      } catch {
        times = ['08:00'];
      }

      for (const timeStr of times) {
        const [hours, mins] = timeStr.split(':').map(Number);
        const dueTime = new Date(now);
        dueTime.setHours(hours, mins, 0, 0);

        const eventId = `dose_${sched.id}_${todayStr}_${timeStr.replace(':', '')}`;
        const existing = this.state.doseEvents.find((e) => e.id === eventId);

        if (!existing) {
          // Determine initial status based on due time vs current time
          const isPast = dueTime.getTime() < now.getTime() - 1000 * 60 * 30; // 30m buffer
          const status = isPast ? 'due' : 'pending';

          this.state.doseEvents.push({
            id: eventId,
            schedule_id: sched.id,
            medicine_id: med.id,
            medicine_name: med.display_name,
            strength: med.strength,
            due_at: dueTime.getTime(),
            status,
            food_relation: sched.food_relation,
            qty_text: sched.qty_text,
          });
        }
      }
    }

    // Sort by due time
    this.state.doseEvents.sort((a, b) => a.due_at - b.due_at);
  }

  // --- CRUD Operations ---

  public addMedicine(medicine: Medicine) {
    this.state.medicines.push(medicine);
    this.saveState();
  }

  public addSchedule(schedule: Schedule) {
    this.state.schedules.push(schedule);
    if (schedule.confirm_status === 'confirmed') {
      this.generateTodayDoses();
    }
    this.saveState();
  }

  public addExpiryRecord(expiry: ExpiryRecord) {
    this.state.expiryRecords.push(expiry);
    this.saveState();
  }

  public markDoseTaken(doseId: string) {
    const dose = this.state.doseEvents.find((d) => d.id === doseId);
    if (dose) {
      dose.status = 'taken';
      dose.acted_at = Date.now();

      // S7: CANCEL ANY PENDING GUARDIAN ESCALATIONS IMMEDIATELY
      for (const esc of this.state.escalations) {
        if (esc.dose_event_id === doseId && esc.state === 'scheduled') {
          esc.state = 'cancelled';
          esc.cancelled_at = Date.now();
        }
      }

      // Queue sync to cancel backend escalation
      this.queueSyncOp('cancel_escalation', { dose_id: doseId });

      this.saveState();
    }
  }

  public postponeDose(doseId: string, minutes: number) {
    const dose = this.state.doseEvents.find((d) => d.id === doseId);
    if (dose) {
      dose.status = 'postponed';
      dose.postponed_until = Date.now() + minutes * 60000;
      this.saveState();
    }
  }

  public undoDose(doseId: string) {
    const dose = this.state.doseEvents.find((d) => d.id === doseId);
    if (dose) {
      dose.status = 'due';
      dose.acted_at = undefined;
      this.saveState();
    }
  }

  public logUnverifiedAck(contentItemId: string, action: AckLog['action']) {
    const log: AckLog = {
      id: 'ack_' + Date.now(),
      content_item_id: contentItemId,
      acknowledged_at: Date.now(),
      action,
    };
    this.state.ackLogs.push(log);
    this.saveState();
  }

  public updateSettings(partial: Partial<LocalDatabaseState['settings']>) {
    this.state.settings = { ...this.state.settings, ...partial };
    this.saveState();
  }

  public updateGuardian(guardian: Guardian) {
    const idx = this.state.guardians.findIndex((g) => g.id === guardian.id);
    if (idx >= 0) {
      this.state.guardians[idx] = guardian;
    } else {
      this.state.guardians.push(guardian);
    }
    this.saveState();
  }

  public queueSyncOp(op: SyncQueueItem['op'], payload: any) {
    this.state.syncQueue.push({
      id: 'sync_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      op,
      payload_json: JSON.stringify(payload),
      attempts: 0,
      next_try_at: Date.now(),
      created_at: Date.now(),
    });
    this.saveState();
  }

  /**
   * Bundle Importer
   * S9 & S10: Only code path that can promote items to 'verified'
   */
  public applySignedBundle(
    bundleVersion: string,
    verifiedKeys: string[],
    reviewerId?: string
  ) {
    for (const item of this.state.contentItems) {
      if (item.locale === 'te' && verifiedKeys.includes(item.key)) {
        item.verification_status = 'verified';
        item.reviewer_id = reviewerId || 'rev_pharmacist_01';
        item.reviewed_at = Date.now();
        item.bundle_version = bundleVersion;
      }
    }
    this.state.settings.installedBundleVersion = bundleVersion;
    this.saveState();
  }
}

export const localDb = new LocalDatabase();
