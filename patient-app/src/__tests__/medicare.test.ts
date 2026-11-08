import { describe, it, expect, beforeEach } from 'vitest';
import { localDb } from '../db/localStore';
import { t, supportedLanguages, SupportedLocale } from '../../../shared/ux-copy';

describe('MEDICARE Core System & Safety Specifications', () => {
  beforeEach(() => {
    localDb.resetToDefaults();
  });

  it('supports all 5 poster languages (English, Telugu, Hindi, Tamil, Kannada)', () => {
    expect(supportedLanguages.length).toBe(5);
    const codes = supportedLanguages.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('te');
    expect(codes).toContain('hi');
    expect(codes).toContain('ta');
    expect(codes).toContain('kn');
  });

  it('correctly translates core brand titles and actions across languages', () => {
    const enTagline = t('brand.tagline', 'en');
    const teTagline = t('brand.tagline', 'te');
    const hiTagline = t('brand.tagline', 'hi');

    expect(enTagline).toBe('Smart Medicine. Safe Life.');
    expect(teTagline).toBe('స్మార్ట్ మెడిసిన్. సురక్షిత జీవనం.');
    expect(hiTagline).toBe('स्मार्ट मेडिसिन। सुरक्षित जीवन।');
  });

  it('records user registration and persistent authentication state in offline store', () => {
    localDb.setCurrentUser({
      fullName: 'Dr. Balu',
      mobile: '+91 98765 43210',
      email: 'balu@medicare.health',
      isLoggedIn: true,
    });

    const state = localDb.getState();
    expect(state.currentUser?.fullName).toBe('Dr. Balu');
    expect(state.currentUser?.isLoggedIn).toBe(true);
  });

  it('records ₹1 clinical verification payment in audit state', () => {
    localDb.recordPayment('Paracetamol 500 mg', 1);
    const state = localDb.getState();
    expect(state.paymentHistory).toBeDefined();
    expect(state.paymentHistory?.length).toBeGreaterThan(0);
    expect(state.paymentHistory?.[0].amount).toBe(1);
    expect(state.paymentHistory?.[0].status).toBe('paid');
  });

  it('records unused medicine donation requests with authorized centre details', () => {
    localDb.addDonation(
      'Paracetamol 500 mg',
      '2 Strips (20 Tablets)',
      'Indian Red Cross Society'
    );
    const state = localDb.getState();
    expect(state.donations).toBeDefined();
    expect(state.donations?.length).toBe(1);
    expect(state.donations?.[0].centre).toBe('Indian Red Cross Society');
  });

  it('logs user feedback and star ratings in local store', () => {
    localDb.addFeedback(5, 'Excellent medication safety app!');
    const state = localDb.getState();
    expect(state.feedbackList).toBeDefined();
    expect(state.feedbackList?.[0].rating).toBe(5);
    expect(state.feedbackList?.[0].message).toBe('Excellent medication safety app!');
  });
});

