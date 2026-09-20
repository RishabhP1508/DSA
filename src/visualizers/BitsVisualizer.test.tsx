/**
 * R4 follow-up #2: BitsVisualizer must extract bits with integer-safe math, not
 * JavaScript's 32-bit `>>`. It must render ordinary, 32-bit-plus, large
 * (string-encoded), zero, and negative Python integers, and explain negatives
 * consistently with Python's bitwise (two's-complement) behavior.
 *
 * Rendered-output tests (inspect the produced SVG) written before the fix:
 *   - 2**32 currently renders all-zero (JS `>>` wraps at 32 bits);
 *   - a string-encoded big int (> 2^53) currently can't render at all.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { BitsVisualizer } from "./BitsVisualizer";
import type { TraceEvent, TraceValue, VisualBinding } from "../core/types";

afterEach(cleanup);

function intEvent(name: string, value: number | string): TraceEvent {
  return {
    index: 0, kind: "line", line: 1,
    frames: [{ name: "<module>", line: 1, locals: [{ name, value: { kind: "int", value } as TraceValue }] }],
    objects: {},
  };
}

const binding: VisualBinding = { variable: "x", model: "bits" };

/** The rendered bit cells, MSB-first, as a string of "0"/"1". */
function bitsOf(container: HTMLElement): string {
  const cells = Array.from(container.querySelectorAll("text.cell-value-sm"));
  return cells.map((t) => t.textContent).join("");
}
function renderedSomething(container: HTMLElement): boolean {
  return container.querySelector("svg") !== null;
}

describe("BitsVisualizer — integer-safe bit extraction", () => {
  it("255 renders as 8 set low bits (ordinary value)", () => {
    const { container } = render(<BitsVisualizer event={intEvent("x", 255)} binding={binding} />);
    const bits = bitsOf(container);
    // Low 8 bits all 1; value is 11111111.
    expect(bits.endsWith("11111111")).toBe(true);
    expect(bits.replace(/0+/, "")).toBe("11111111"); // no stray high bits set
  });

  it("2**32 renders with exactly bit 32 set (NOT all-zero from a 32-bit shift)", () => {
    const { container } = render(<BitsVisualizer event={intEvent("x", 4294967296)} binding={binding} />);
    const bits = bitsOf(container);
    // Exactly one '1', and it is at position 32 (i.e. 32 trailing zeros).
    expect((bits.match(/1/g) ?? []).length).toBe(1);
    expect(bits.endsWith("1" + "0".repeat(32))).toBe(true);
  });

  it("renders a large string-encoded integer (2**80) with exactly bit 80 set", () => {
    const { container } = render(
      <BitsVisualizer event={intEvent("x", "1208925819614629174706176")} binding={binding} />,
    );
    expect(renderedSomething(container)).toBe(true);
    const bits = bitsOf(container);
    expect((bits.match(/1/g) ?? []).length).toBe(1);
    expect(bits.endsWith("1" + "0".repeat(80))).toBe(true);
  });

  it("0 renders as all-zero bits (no crash, min width)", () => {
    const { container } = render(<BitsVisualizer event={intEvent("x", 0)} binding={binding} />);
    const bits = bitsOf(container);
    expect(bits.length).toBeGreaterThanOrEqual(8);
    expect(/^0+$/.test(bits)).toBe(true);
  });

  it("negative integers render (magnitude bits) with a Python two's-complement note", () => {
    const { container } = render(<BitsVisualizer event={intEvent("x", -5)} binding={binding} />);
    expect(renderedSomething(container)).toBe(true);
    // Some explanatory text mentions two's complement / negative handling.
    expect(container.textContent ?? "").toMatch(/two's complement|negative|sign/i);
    // The magnitude 5 = 101 is representable in the low bits.
    const bits = bitsOf(container);
    expect(bits.endsWith("00000101")).toBe(true);
  });
});

describe("BitsVisualizer — bounded rendering for huge integers", () => {
  // 1 << 10000 has 10001 bits; the decimal string is ~3011 digits.
  const oneShl10000 = (1n << 10000n).toString();

  it("caps the rendered cell count for a 10001-bit integer and marks omitted bits", () => {
    const start = Date.now();
    const { container } = render(<BitsVisualizer event={intEvent("x", oneShl10000)} binding={binding} />);
    // Bounded work: constructing the diagram must not take time proportional to
    // 10000 bits. (Generous bound to avoid CI flakiness.)
    expect(Date.now() - start).toBeLessThan(2000);

    // Cell count is bounded well below the true bit width.
    const cells = container.querySelectorAll("rect");
    expect(cells.length).toBeGreaterThan(0);
    expect(cells.length).toBeLessThanOrEqual(256);

    // The diagram clearly indicates that higher bits were omitted.
    expect(container.textContent ?? "").toMatch(/omitted|not shown|higher bits|truncat|too large/i);

    // The full value remains available (shown in the title/label).
    expect(container.textContent ?? "").toContain(oneShl10000.slice(0, 12));
  });

  it("shows accurate bit-position labels for the retained low bits", () => {
    const { container } = render(<BitsVisualizer event={intEvent("x", oneShl10000)} binding={binding} />);
    // The retained window is the LOW bits: position 0 (LSB) must be present and
    // labelled, and 1 << 10000 has its low bits all zero.
    const posLabels = Array.from(container.querySelectorAll("text.cell-index")).map((t) => t.textContent);
    expect(posLabels).toContain("0"); // LSB position labelled
    const bits = bitsOf(container);
    // Low bits of 1<<10000 are all zero.
    expect(/^0+$/.test(bits)).toBe(true);
  });

  it("does NOT truncate a merely-large but in-range value (2**80 keeps all 81 bits)", () => {
    const { container } = render(
      <BitsVisualizer event={intEvent("x", "1208925819614629174706176")} binding={binding} />,
    );
    // No omitted-bits marker for a value within the display cap.
    expect(container.textContent ?? "").not.toMatch(/omitted|not shown|higher bits|too large/i);
    const bits = bitsOf(container);
    expect(bits.endsWith("1" + "0".repeat(80))).toBe(true);
  });
});
