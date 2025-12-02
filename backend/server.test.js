import { describe, it, expect } from 'vitest';
import { normalizeCouponFields, validateCoupon, updateExpiredCoupons, getNextCouponId } from './server.js';

describe('normalizeCouponFields', () => {
  it('should convert all fields to correct types', () => {
    const raw = { id: '5', name: 123, minPurchase: '50', discount: '10', status: null, expireDate: '2025-12-01' };
    const normalized = normalizeCouponFields(raw);

    expect(normalized).toEqual({
      id: 5,
      name: '123',       // converted to string
      minPurchase: 50,
      discount: 10,
      status: 'valid',   // default applied
      expireDate: '2025-12-01'
    });
  });

  it('should default missing fields', () => {
    const raw = { id: 1 };
    const normalized = normalizeCouponFields(raw);

    expect(normalized).toEqual({
      id: 1,
      name: '',
      minPurchase: NaN,  // remains NaN if missing
      discount: NaN,
      status: 'valid',
      expireDate: null
    });
  });
});

describe('validateCoupon', () => {
  it('should return null for valid numbers', () => {
    const coupon = { minPurchase: 50, discount: 10 };
    expect(validateCoupon(coupon)).toBeNull();
  });

  it('should detect invalid minPurchase', () => {
    const coupon = { minPurchase: 'abc', discount: 10 };
    expect(validateCoupon(coupon)).toBe('minPurchase must be a valid number');
  });

  it('should detect invalid discount', () => {
    const coupon = { minPurchase: 10, discount: 'abc' };
    expect(validateCoupon(coupon)).toBe('discount must be a valid number');
  });
});

describe('updateExpiredCoupons', () => {
  it('should mark expired coupons correctly', () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const coupons = [
      { id: 1, status: 'valid', expireDate: yesterday },
      { id: 2, status: 'valid', expireDate: tomorrow },
      { id: 3, status: 'redeemed', expireDate: yesterday }
    ];

    const { updated, changed } = updateExpiredCoupons(coupons);

    expect(changed).toBe(true);
    expect(updated.find(c => c.id === 1).status).toBe('expired'); // yesterday expired
    expect(updated.find(c => c.id === 2).status).toBe('valid');   // tomorrow still valid
    expect(updated.find(c => c.id === 3).status).toBe('redeemed'); // already redeemed
  });

  it('should not change coupons without expireDate', () => {
    const coupons = [{ id: 1, status: 'valid' }];
    const { updated, changed } = updateExpiredCoupons(coupons);

    expect(changed).toBe(false);
    expect(updated[0].status).toBe('valid');
  });
});

describe('getNextCouponId', () => {
  it('should return 1 if array is empty', () => {
    expect(getNextCouponId([])).toBe(1);
  });

  it('should return the next numeric ID', () => {
    const coupons = [{ id: '1' }, { id: 2 }, { id: '5' }];
    expect(getNextCouponId(coupons)).toBe(6);
  });
});
