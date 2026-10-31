/**
 * S08 Manual Setup Stepper Screen
 * Implements ref/05-screen-specs.md S08
 * Minimal typing flow using pickers and curated choices for elderly accessibility.
 */

import React, { useState } from 'react';
import { StepHeader } from '../components/StepHeader';
import { ActionButton } from '../components/ActionButton';
import { PictogramTile } from '../components/PictogramTile';
import { curatedMedicineCatalogue } from '../../../shared/catalogue';
import { ExtractedMedicineDraft, FoodRelation } from '../../../shared/contracts';
import { Check, ChevronRight } from 'lucide-react';

interface S08ManualSetupProps {
  onBack: () => void;
  onComplete: (medicineDraft: ExtractedMedicineDraft) => void;
}

export const S08_ManualSetup: React.FC<S08ManualSetupProps> = ({
  onBack,
  onComplete,
}) => {
  const [subStep, setSubStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('Metformin');
  const [strength, setStrength] = useState('500 mg');
  const [form, setForm] = useState('tablet');
  const [doseQty, setDoseQty] = useState('1');
  const [timings, setTimings] = useState<string[]>(['08:00', '20:00']);
  const [foodRelation, setFoodRelation] = useState<FoodRelation>('after');

  const toggleTiming = (time: string) => {
    if (timings.includes(time)) {
      if (timings.length > 1) {
        setTimings(timings.filter((t) => t !== time));
      }
    } else {
      setTimings([...timings, time].sort());
    }
  };

  const handleFinish = () => {
    const draft: ExtractedMedicineDraft = {
      temp_id: 'manual_' + Date.now(),
      name,
      name_confidence: 1.0,
      strength,
      strength_confidence: 1.0,
      form,
      dose_qty: doseQty,
      dose_confidence: 1.0,
      frequency: 'daily_times',
      timings,
      timings_confidence: 1.0,
      food_relation: foodRelation,
      food_confidence: 1.0,
      duration_days: 30,
      duration_confidence: 1.0,
      is_unclear: false,
    };
    onComplete(draft);
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
        currentStep={subStep}
        totalSteps={4}
        title={
          subStep === 1
            ? 'మందు పేరు (Medicine Name)'
            : subStep === 2
            ? 'మోతాదు & రూపం (Strength & Form)'
            : subStep === 3
            ? 'సమయాలు (Timings)'
            : 'ఆహార సంబంధం (Food Relation)'
        }
        onBack={() => (subStep > 1 ? setSubStep((s) => (s - 1) as any) : onBack())}
      />

      {/* Step 1: Pick Medicine Name */}
      {subStep === 1 && (
        <div>
          <p className="type-body" style={{ margin: '0 0 16px 0', color: 'var(--color-quiet)' }}>
            కింది జాబితా నుండి ఎంచుకోండి లేదా టైప్ చేయండి:
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search or enter medicine name"
            aria-label="Medicine name"
            style={{
              width: '100%',
              minHeight: 'var(--target-min)',
              padding: '12px 16px',
              fontSize: 'calc(20px * var(--font-scale))',
              borderRadius: 'var(--radius-field)',
              border: '2px solid var(--color-care)',
              backgroundColor: '#FFFFFF',
              marginBottom: '16px',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {curatedMedicineCatalogue.map((med) => (
              <button
                key={med.medicine_id}
                type="button"
                onClick={() => setName(med.name)}
                style={{
                  minHeight: '64px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-field)',
                  backgroundColor: name === med.name ? 'var(--color-care-tint)' : 'var(--color-surface)',
                  border: `2px solid ${name === med.name ? 'var(--color-care)' : 'var(--color-line-soft)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                }}
              >
                <div>
                  <strong style={{ fontSize: 'calc(18px * var(--font-scale))', color: 'var(--color-ink)' }}>
                    {med.name}
                  </strong>
                  <div style={{ fontSize: 'calc(14px * var(--font-scale))', color: 'var(--color-quiet)' }}>
                    {med.category}
                  </div>
                </div>
                {name === med.name && <Check size={22} color="var(--color-care)" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Strength, Form, and Quantity */}
      {subStep === 2 && (
        <div>
          <label style={{ display: 'block', fontSize: 'calc(16px * var(--font-scale))', fontWeight: 600, marginBottom: '8px' }}>
            బలం / మోతాదు (Strength):
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {['500 mg', '650 mg', '40 mg', '5 mg', '10 mg', '20 mg'].map((str) => (
              <button
                key={str}
                onClick={() => setStrength(str)}
                style={{
                  minHeight: '52px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-field)',
                  backgroundColor: strength === str ? 'var(--color-care)' : 'var(--color-surface)',
                  color: strength === str ? '#FFFFFF' : 'var(--color-ink)',
                  border: `2px solid ${strength === str ? 'var(--color-care)' : 'var(--color-line-soft)'}`,
                  fontWeight: 600,
                  fontSize: 'calc(18px * var(--font-scale))',
                }}
              >
                {str}
              </button>
            ))}
          </div>

          <label style={{ display: 'block', fontSize: 'calc(16px * var(--font-scale))', fontWeight: 600, marginBottom: '8px' }}>
            ఒక్కసారికి ఎన్ని? (Dose Quantity):
          </label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['1', '1/2', '2'].map((q) => (
              <button
                key={q}
                onClick={() => setDoseQty(q)}
                style={{
                  flex: 1,
                  minHeight: '56px',
                  borderRadius: 'var(--radius-field)',
                  backgroundColor: doseQty === q ? 'var(--color-care)' : 'var(--color-surface)',
                  color: doseQty === q ? '#FFFFFF' : 'var(--color-ink)',
                  border: `2px solid ${doseQty === q ? 'var(--color-care)' : 'var(--color-line-soft)'}`,
                  fontWeight: 700,
                  fontSize: 'calc(20px * var(--font-scale))',
                }}
              >
                {q} మాత్ర
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Timings */}
      {subStep === 3 && (
        <div>
          <p className="type-body" style={{ margin: '0 0 16px 0', color: 'var(--color-quiet)' }}>
            ఏ ఏ సమయాల్లో వేసుకోవాలి? (Select daily reminder times):
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { time: '08:00', label: 'ఉదయం (Morning 8:00 AM)', type: 'morning' as const },
              { time: '13:00', label: 'మధ్యాహ్నం (Afternoon 1:00 PM)', type: 'afternoon' as const },
              { time: '18:00', label: 'సాయంత్రం (Evening 6:00 PM)', type: 'evening' as const },
              { time: '20:00', label: 'రాత్రి (Night 8:00 PM)', type: 'night' as const },
            ].map(({ time, label, type }) => {
              const active = timings.includes(time);
              return (
                <button
                  key={time}
                  onClick={() => toggleTiming(time)}
                  style={{
                    minHeight: '68px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-field)',
                    backgroundColor: active ? 'var(--color-care-tint)' : 'var(--color-surface)',
                    border: `2px solid ${active ? 'var(--color-care)' : 'var(--color-line-soft)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <PictogramTile type={type} size={24} />
                    <strong style={{ fontSize: 'calc(18px * var(--font-scale))', color: 'var(--color-ink)' }}>
                      {label}
                    </strong>
                  </div>
                  {active && <Check size={24} color="var(--color-care)" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Food Relation */}
      {subStep === 4 && (
        <div>
          <p className="type-body" style={{ margin: '0 0 16px 0', color: 'var(--color-quiet)' }}>
            ఆహారంతో సంబంధం (Food Relation):
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { rel: 'after' as const, label: 'భోజనం తర్వాత (After Food)', picto: 'after_food' as const },
              { rel: 'before' as const, label: 'భోజనం ముందు (Before Food)', picto: 'before_food' as const },
              { rel: 'with' as const, label: 'భోజనంతో పాటు (With Food)', picto: 'with_food' as const },
            ].map(({ rel, label, picto }) => (
              <button
                key={rel}
                onClick={() => setFoodRelation(rel)}
                style={{
                  minHeight: '68px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-field)',
                  backgroundColor: foodRelation === rel ? 'var(--color-care-tint)' : 'var(--color-surface)',
                  border: `2px solid ${foodRelation === rel ? 'var(--color-care)' : 'var(--color-line-soft)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <PictogramTile type={picto} size={24} />
                  <strong style={{ fontSize: 'calc(18px * var(--font-scale))', color: 'var(--color-ink)' }}>
                    {label}
                  </strong>
                </div>
                {foodRelation === rel && <Check size={24} color="var(--color-care)" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stepper Footer Action */}
      <div style={{ marginTop: '32px' }}>
        {subStep < 4 ? (
          <ActionButton
            variant="primary"
            onClick={() => setSubStep((s) => (s + 1) as any)}
            icon={<ChevronRight size={24} />}
          >
            తదుపరి (Next)
          </ActionButton>
        ) : (
          <ActionButton
            variant="primary"
            onClick={handleFinish}
            icon={<Check size={24} />}
          >
            సమీక్షకు వెళ్లండి (Proceed to Review)
          </ActionButton>
        )}
      </div>
    </div>
  );
};
