import { describe, expect, it } from "vitest";
import { BUBBLE_W, holeFor, placeBubble } from "./geometry";

const phone = { w: 390, h: 844 };
const desktop = { w: 1280, h: 800 };

describe("holeFor", () => {
  it("pads the target and keeps it inside the viewport", () => {
    expect(holeFor({ x: 100, y: 100, w: 50, h: 40 }, desktop, 8)).toEqual({ x: 92, y: 92, w: 66, h: 56 });
    const h = holeFor({ x: -50, y: 700, w: 600, h: 400 }, phone, 8);
    expect(h.x).toBe(4);
    expect(h.x + h.w).toBe(phone.w - 4);
    expect(h.y + h.h).toBe(phone.h - 4);
  });
});

describe("placeBubble", () => {
  it("goes below a small target near the top", () => {
    const s = placeBubble({ x: 20, y: 60, w: 300, h: 80 }, phone);
    expect(s.side).toBe("bottom");
    expect(s.style.top).toBe(60 + 80 + 14);
  });

  it("goes above a target near the bottom (the Ship button)", () => {
    const s = placeBubble({ x: 12, y: 740, w: 366, h: 80 }, phone, "bottom");
    expect(s.side).toBe("top");
  });

  it("goes beside a full-height column on desktop", () => {
    const s = placeBubble({ x: 860, y: 70, w: 410, h: 720 }, desktop);
    expect(s.side).toBe("left");
    expect(s.style.left).toBe(860 - 14 - BUBBLE_W);
  });

  it("falls back inside the spotlight when nothing fits", () => {
    const s = placeBubble({ x: 4, y: 4, w: 382, h: 836 }, phone);
    expect(s.side).toBe("inside");
    expect(s.arrow).toBeUndefined();
  });

  it("never leaves the screen horizontally", () => {
    const s = placeBubble({ x: 340, y: 10, w: 44, h: 44 }, phone);
    const left = s.style.left as number;
    expect(left).toBeGreaterThanOrEqual(12);
    expect(left + Math.min(BUBBLE_W, phone.w - 32)).toBeLessThanOrEqual(phone.w - 12);
  });
});
