import { describe, it, expect } from 'vitest';
import { ExpStatus } from '../contracts';

/**
 * Expiry logic test helper mirroring S06_ExpiryConfirm engine
 */
export function calculateExpiryStatus(expDateStr: string | null | undefined, referenceDateStr?: string): ExpStatus {
  if (!expDateStr || expDateStr.trim() === '' || expDateStr.toLowerCase() === 'unknown') {
    return 'unknown';
  }

  const [yearStr, monthStr] = expDateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return 'unknown';
  }

  const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date('2026-11-01');
  // Expiry is end of the expiry month
  const expDate = new Date(year, month, 0, 23, 59, 59, 999);

  if (expDate.getTime() < refDate.getTime()) {
    return 'expired';
  }

  // Near expiry: within 30 days
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  if (expDate.getTime() - refDate.getTime() <= thirtyDaysMs) {
    return 'near_expiry';
  }

  return 'valid';
}

describe('S3: Expiry Engine & Unknown Stays Unknown', () => {
  const refDate = '2026-11-01T00:00:00Z';

  it('S3 invariant: empty, missing, or unclear expiry date returns unknown and never guesses', () => {
    expect(calculateExpiryStatus(null, refDate)).toBe('unknown');
    expect(calculateExpiryStatus(undefined, refDate)).toBe('unknown');
    expect(calculateExpiryStatus('', refDate)).toBe('unknown');
    expect(calculateExpiryStatus('unknown', refDate)).toBe('unknown');
    expect(calculateExpiryStatus('2026-??', refDate)).toBe('unknown');
  });

  it('identifies expired medications correctly', () => {
    // Expired in Oct 2026 or earlier
    expect(calculateExpiryStatus('2026-09', refDate)).toBe('expired');
    expect(calculateExpiryStatus('2026-10', refDate)).toBe('expired');
    expect(calculateExpiryStatus('2025-12', refDate)).toBe('expired');
  });

  it('identifies near-expiry medications within 30-day window', () => {
    // Current date Nov 1, 2026 -> expiry in Nov 2026 (Nov 30) is within 30 days
    expect(calculateExpiryStatus('2026-11', refDate)).toBe('near_expiry');
  });

  it('identifies valid medications beyond the 30-day threshold', () => {
    expect(calculateExpiryStatus('2027-01', refDate)).toBe('valid');
    expect(calculateExpiryStatus('2028-06', refDate)).toBe('valid');
  });
});

