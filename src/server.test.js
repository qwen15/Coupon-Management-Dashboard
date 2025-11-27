import { describe, it, expect } from "vitest";
import { 
  normalizeCouponFields, 
  updateExpiredCoupons, 
  getNextCouponId 
} from "./server";

describe("Coupon Utils", () => {

  it("normalizeCouponFields converts fields correctly", () => {
    const input = { id: 1, name: "SAVE10", minPurchase: "50", discount: "10", status: "valid", expireDate: "2025-12-31" };
    const normalized = normalizeCouponFields(input);

    expect(normalized.id).toBe("1");           
    expect(normalized.minPurchase).toBe(50);   
    expect(normalized.discount).toBe(10);      
    expect(normalized.name).toBe("SAVE10");
    expect(normalized.status).toBe("valid");
    expect(normalized.expireDate).toBe("2025-12-31");
  });

  it("updateExpiredCoupons marks past coupons as expired", () => {
    const coupons = [
      { id: "1", name: "C1", status: "valid", expireDate: "2020-01-01" },
      { id: "2", name: "C2", status: "valid", expireDate: "2999-01-01" },
    ];

    const { updated, changed } = updateExpiredCoupons(coupons, new Date("2025-01-01"));

    expect(changed).toBe(true);
    expect(updated[0].status).toBe("expired"); 
    expect(updated[1].status).toBe("valid"); 
  });

  it("updateExpiredCoupons does nothing if no coupons expired", () => {
    const coupons = [
      { id: "1", name: "C1", status: "valid", expireDate: "2999-01-01" },
    ];
    const { updated, changed } = updateExpiredCoupons(coupons, new Date("2025-01-01"));

    expect(changed).toBe(false);
    expect(updated[0].status).toBe("valid");
  });

  it("getNextCouponId returns 1 for empty array", () => {
    expect(getNextCouponId([])).toBe(1);
  });

  it("getNextCouponId returns correct next id for non-empty array", () => {
    const coupons = [
      { id: "1" },
      { id: "3" },
      { id: "2" },
    ];
    expect(getNextCouponId(coupons)).toBe(4);
  });

  it("getNextCouponId handles numeric ids correctly", () => {
    const coupons = [
      { id: 5 },
      { id: 10 },
    ];
    expect(getNextCouponId(coupons)).toBe(11);
  });

});
