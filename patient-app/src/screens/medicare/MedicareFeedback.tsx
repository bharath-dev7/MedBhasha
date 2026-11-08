import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, CheckCircle2, MessageSquare } from 'lucide-react';
import { localDb } from '../../db/localStore';

interface MedicareFeedbackProps {
  onBack: () => void;
  onSubmitSuccess?: () => void;
}

export const MedicareFeedback: React.FC<MedicareFeedbackProps> = ({
  onBack,
  onSubmitSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localDb.addFeedback(rating, comments);
    setSubmitted(true);
    setTimeout(() => {
      if (onSubmitSuccess) onSubmitSuccess();
    }, 1500);
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
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 0 8px', color: '#0F172A' }}>
            Feedback
          </h2>
        </div>

        {/* Center Feedback Hero (Poster Screen 14) */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
              border: '2px solid #BFDBFE',
            }}
          >
            <Heart size={32} />
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
            Your Feedback Matters!
          </h3>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            Rate your experience
          </p>

          {/* 5 Star Rating */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '20px 0 10px 0' }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: filled ? '#F59E0B' : '#E2E8F0',
                    transition: 'transform 0.1s ease',
                  }}
                >
                  <Star size={36} fill={filled ? '#F59E0B' : 'none'} strokeWidth={1.8} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggestion Textarea */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
              Your Suggestions &amp; Comments
            </label>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Your suggestions..."
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                border: '1.5px solid #CBD5E1',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                resize: 'none',
                backgroundColor: '#F8FAFC',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="medicare-btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '16px' }}
          >
            {submitted ? (
              <>
                <CheckCircle2 size={20} />
                <span>Feedback Submitted!</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8' }}>
        Thank you for helping us make MEDICARE safer for everyone.
      </div>
    </div>
  );
};

