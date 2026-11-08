import { describe, it, expect, beforeEach } from 'vitest';
import { localDb } from '../db/localStore';
import { Medicine, Schedule } from '../../../shared/contracts';

// In-memory mock for localStorage if running in node environment
if (typeof globalThis.localStorage === 'undefined') {
  let store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => {
      store[key] = val;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (i: number) => Object.keys(store)[i] || null,
    length: 0,
  } as any;
}

describe('S2, S6, S7: Offline LocalStore & Safety Invariants', () => {
  beforeEach(async () => {
    localStorage.clear();
    await localDb.seedDefaultData();
  });

  it('S2 invariant: draft schedules NEVER produce dose events', () => {
    const draftMed: Medicine = {
      id: 'med_draft_test',
      display_name: 'Unconfirmed Drug',
      source: 'scan_rx',
      confirm_status: 'draft',
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    const draftSchedule: Schedule = {
      id: 'sched_draft_test',
      medicine_id: draftMed.id,
      frequency_type: 'daily_times',
      times_json: JSON.stringify(['14:00']),
      tz_id: 'Asia/Kolkata',
      food_relation: 'after',
      qty_text: '1',
      start_date: new Date().toISOString().split('T')[0],
      confirm_status: 'draft', // DRAFT
    };

    localDb.addMedicine(draftMed);
    localDb.addSchedule(draftSchedule);

    const state = localDb.getState();
    const generatedDoses = state.doseEvents.filter((d) => d.medicine_id === draftMed.id);

    // S2 Invariant: zero doses must be generated for draft
    expect(generatedDoses).toHaveLength(0);
  });

  it('S6 invariant: confirmed schedules generate offline dose events for Day Arc', () => {
    const confirmedMed: Medicine = {
      id: 'med_confirmed_test',
      display_name: 'Metformin Confirmed',
      strength: '500 mg',
      source: 'manual',
      confirm_status: 'confirmed',
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    const confirmedSchedule: Schedule = {
      id: 'sched_confirmed_test',
      medicine_id: confirmedMed.id,
      frequency_type: 'daily_times',
      times_json: JSON.stringify(['08:00', '20:00']),
      tz_id: 'Asia/Kolkata',
      food_relation: 'after',
      qty_text: '1 tablet',
      start_date: new Date().toISOString().split('T')[0],
      confirm_status: 'confirmed',
    };

    localDb.addMedicine(confirmedMed);
    localDb.addSchedule(confirmedSchedule);

    const state = localDb.getState();
    const doses = state.doseEvents.filter((d) => d.medicine_id === confirmedMed.id);

    // Must generate 2 dose events (08:00 and 20:00)
    expect(doses.length).toBeGreaterThanOrEqual(2);
    expect(doses.map((d) => d.medicine_name)).toContain('Metformin Confirmed');
  });

  it('weekly schedules do not create a dose on a day outside their repeat days', () => {
    const now = new Date();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const otherDay = weekdays[(now.getDay() + 1) % weekdays.length];
    const medicine: Medicine = {
      id: 'med_weekly_test',
      display_name: 'Weekly test medicine',
      source: 'manual',
      confirm_status: 'confirmed',
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    const schedule: Schedule = {
      id: 'sched_weekly_test',
      medicine_id: medicine.id,
      frequency_type: 'weekly_days',
      times_json: JSON.stringify(['08:00']),
      repeat_days: [otherDay],
      tz_id: 'Asia/Kolkata',
      food_relation: 'unspecified',
      qty_text: '1 tablet',
      start_date: new Date().toISOString().split('T')[0],
      confirm_status: 'confirmed',
    };

    localDb.addMedicine(medicine);
    localDb.addSchedule(schedule);

    expect(localDb.getState().doseEvents.filter((dose) => dose.medicine_id === medicine.id)).toHaveLength(0);
  });

  it('S7 invariant: marking a dose as taken immediately cancels any pending guardian alert', () => {
    const state = localDb.getState();
    const testDose = state.doseEvents[0];
    expect(testDose).toBeDefined();

    // Create a scheduled escalation for this dose
    state.escalations.push({
      id: 'esc_test_1',
      dose_event_id: testDose.id,
      state: 'scheduled',
      scheduled_at: Date.now() + 1800000,
      message_preview: 'Medication dose missed alert',
      phone: '+919876543210',
    });

    // Action: Mark dose as Taken
    localDb.markDoseTaken(testDose.id);

    // Check updated dose status
    const updatedState = localDb.getState();
    const updatedDose = updatedState.doseEvents.find((d) => d.id === testDose.id);
    expect(updatedDose?.status).toBe('taken');

    // S7 Invariant: Escalation must be cancelled immediately
    const updatedEsc = updatedState.escalations.find((e) => e.id === 'esc_test_1');
    expect(updatedEsc?.state).toBe('cancelled');
    expect(updatedEsc?.cancelled_at).toBeDefined();
  });
});
