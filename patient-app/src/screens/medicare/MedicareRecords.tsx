import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Calendar, Plus, Pill, ChevronRight, Check } from 'lucide-react';
import { localDb } from '../../db/localStore';

interface MedicareRecordsProps {
  onBack: () => void;
  onSelectMedicine?: (medicineId: string) => void;
  onAddNew?: () => void;
}

export const MedicareRecords: React.FC<MedicareRecordsProps> = ({
  onBack,
  onSelectMedicine,
  onAddNew,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const dbState = localDb.getState();

  // Baseline records + user records from local DB
  const defaultRecords = [
    {
      id: 'rec_1',
      name: 'Paracetamol 500 mg',
      schedule: '08:00 AM • 5 Days',
      status: 'active',
      verified: true,
      form: 'tablet',
    },
    {
      id: 'rec_2',
      name: 'Amoxicillin 500 mg',
      schedule: '09:00 PM • 7 Days',
      status: 'active',
      verified: true,
      form: 'capsule',
    },
    {
      id: 'rec_3',
      name: 'Vitamin D3',
      schedule: 'Once Weekly • Sunday',
      status: 'active',
      verified: false,
      form: 'tablet',
    },
    {
      id: 'rec_4',
      name: 'Pantoprazole 40 mg',
      schedule: 'Completed 10-day course',
      status: 'completed',
      verified: true,
      form: 'tablet',
    },
  ];

  // Merge with any user confirmed medicines
  const userMeds = dbState.medicines.map((m) => ({
    id: m.id,
    name: m.display_name + (m.strength ? ' ' + m.strength : ''),
    schedule: 'Scheduled in app',
    status: 'active' as const,
    verified: m.confirm_status === 'confirmed',
    form: m.form,
  }));

  const allRecords = [...defaultRecords, ...userMeds.filter((u) => !defaultRecords.some((d) => d.name === u.name))];

  const filteredRecords = allRecords.filter((rec) => {
    if (activeTab === 'active') return rec.status === 'active';
    if (activeTab === 'completed') return rec.status === 'completed';
    return true;
  });

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8FAFC',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
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
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0F172A' }}>My Records</h2>
        <button
          onClick={onAddNew}
          style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Tabs Filter (All | Active | Completed) as shown in Poster */}
      <div style={{ padding: '16px 20px 8px 20px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#E2E8F0',
            borderRadius: '12px',
            padding: '4px',
          }}
        >
          {(['all', 'active', 'completed'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? '#0F172A' : '#64748B',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Medicine Records List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredRecords.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectMedicine && onSelectMedicine(item.id)}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Status Circle / Pill Icon */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: item.verified ? '#DCFCE7' : '#EFF6FF',
                  color: item.verified ? '#16A34A' : '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.verified ? <Check size={22} strokeWidth={2.8} /> : <Pill size={22} />}
              </div>

              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  {item.schedule}
                </div>
              </div>
            </div>

            <ChevronRight size={18} color="#94A3B8" />
          </div>
        ))}
      </div>
    </div>
  );
};

