import React, { useState } from 'react';
import { ArrowLeft, Bell, Minus, Plus, Check, Clock, Volume2, X } from 'lucide-react';
import { localDb } from '../../db/localStore';

interface MedicareDoseReminderProps {
  onBack: () => void;
  onSaved: () => void;
  medicineName?: string;
}

export const MedicareDoseReminder: React.FC<MedicareDoseReminderProps> = ({
  onBack,
  onSaved,
  medicineName = 'Paracetamol 500 mg',
}) => {
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Wed', 'Thu', 'Fri']);
  const [enabled, setEnabled] = useState(true);

  // In-app alert simulation state
  const [showActiveAlarm, setShowActiveAlarm] = useState(false);
  const [alarmSnoozed, setAlarmSnoozed] = useState(false);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const adjustHour = (delta: number) => {
    let newHour = hour + delta;
    if (newHour > 12) newHour = 1;
    if (newHour < 1) newHour = 12;
    setHour(newHour);
  };

  const adjustMinute = (delta: number) => {
    let newMin = minute + delta;
    if (newMin >= 60) newMin = 0;
    if (newMin < 0) newMin = 45;
    setMinute(newMin);
  };

  const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;

  const handleSave = () => {
    const schedId = 'sched_' + Date.now();
    const medId = 'med_' + Date.now();
    localDb.addMedicine({
      id: medId,
      display_name: medicineName,
      strength: '500mg',
      form: 'tablet',
      source: 'manual',
      confirm_status: 'confirmed',
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    localDb.addSchedule({
      id: schedId,
      medicine_id: medId,
      frequency_type: 'custom',
      times_json: JSON.stringify([formattedTime]),
      tz_id: 'Asia/Kolkata',
      qty_text: '1 tablet',
      start_date: new Date().toISOString().split('T')[0],
      confirm_status: 'confirmed',
      confirmed_at: Date.now(),
    });
    onSaved();
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 24px 32px 24px',
        backgroundColor: '#FFFFFF',
        position: 'relative',
      }}
    >
      <div>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Bell Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              border: '2px solid #BFDBFE',
            }}
          >
            <Bell size={32} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
            Set Reminder
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            Medicine: <strong style={{ color: '#1E40AF' }}>{medicineName}</strong>
          </p>
        </div>

        {/* Time Selector (- / + as in poster) */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '20px',
            border: '1.5px solid #E2E8F0',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginBottom: '12px' }}>
            Time
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            {/* Hour Adjuster */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => adjustHour(-1)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Minus size={16} />
              </button>

              <span style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', minWidth: '40px' }}>
                {hour.toString().padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={() => adjustHour(1)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            <span style={{ fontSize: '28px', fontWeight: 800, color: '#64748B' }}>:</span>

            {/* Minute Adjuster */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => adjustMinute(-15)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Minus size={16} />
              </button>

              <span style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', minWidth: '40px' }}>
                {minute.toString().padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={() => adjustMinute(15)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* AM / PM Toggle */}
            <button
              type="button"
              onClick={() => setPeriod(period === 'AM' ? 'PM' : 'AM')}
              style={{
                backgroundColor: '#1E40AF',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {period}
            </button>
          </div>
        </div>

        {/* Days of Week Pills */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
            Repeat Days
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
            {days.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                    color: isSelected ? '#1D4ED8' : '#64748B',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Enable Reminder Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
          }}
        >
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
            Enable Reminder
          </span>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '9999px',
              backgroundColor: enabled ? '#2563EB' : '#CBD5E1',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: enabled ? 'flex-end' : 'flex-start',
              transition: 'background-color 0.2s',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          </button>
        </div>
      </div>

      {/* Save Button & Demo Alarm Trigger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px' }}>
        <button
          onClick={handleSave}
          className="medicare-btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '16px' }}
        >
          <span>Save Reminder</span>
        </button>

        <button
          type="button"
          onClick={() => setShowActiveAlarm(true)}
          style={{
            background: 'none',
            border: '1.5px dashed #3B82F6',
            color: '#2563EB',
            borderRadius: '12px',
            padding: '10px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🔔 Test Live Reminder Alert (Snooze / Stop)
        </button>
      </div>

      {/* Interactive Active Reminder Overlay (Report 6.9 & Poster Features) */}
      {showActiveAlarm && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            zIndex: 100,
          }}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 30px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <Bell size={32} className="animate-bounce" />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', color: '#0F172A' }}>
              Time for your medicine!
            </h3>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#1E40AF', margin: '0 0 4px 0' }}>
              {medicineName}
            </p>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 24px 0' }}>
              1 Tablet after food • Scheduled for {formattedTime}
            </p>

            {/* Snooze & Stop Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => {
                  setAlarmSnoozed(true);
                  setTimeout(() => {
                    setShowActiveAlarm(false);
                    setAlarmSnoozed(false);
                  }, 800);
                }}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {alarmSnoozed ? 'Snoozed 10m' : 'Snooze'}
              </button>

              <button
                onClick={() => setShowActiveAlarm(false)}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Check size={18} />
                <span>Stop / Taken</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

