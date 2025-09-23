import { describe, it, expect } from "vitest";
import { addToCart, updateQty, removeFromCart, calculateTotals } from "../src/utils/cart";

describe("cart utilities", () => {
  it("adds an item when cart empty", () => {
    const product = { id: "p1", title:"X", price:10 };
    const c = addToCart([], product, "M", 2);
    expect(c.length).toBe(1);
    expect(c[0].qty).toBe(2);
  });

  it("increments qty when same item added", () => {
    const product = { id: "p1", title:"X", price:10 };
    const c1 = addToCart([], product, "M", 1);
    const c2 = addToCart(c1, product, "M", 2);
    expect(c2[0].qty).toBe(3);
  });

  it("updates qty", () => {
    const cart = [{ productId:"p1", size:"M", qty:2, price:10 }];
    const updated = updateQty(cart, "p1", "M", 5);
    expect(updated[0].qty).toBe(5);
  });

  it("removes item", () => {
    const cart = [{ productId:"p1", size:"M", qty:2, price:10 }];
    const after = removeFromCart(cart, "p1", "M");
    expect(after.length).toBe(0);
  });

  it("calculates totals", () => {
    const cart = [{ productId:"p1", size:"M", qty:2, price:10 }]; // subtotal 20
    const totals = calculateTotals(cart);
    expect(totals.subtotal).toBe(20);
    expect(totals.tax).toBeCloseTo(2.4); // 12% tax
    expect(typeof totals.total).toBe("number");
  });
});


