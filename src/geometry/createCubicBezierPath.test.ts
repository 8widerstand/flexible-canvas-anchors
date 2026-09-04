import { describe, expect, it } from "vitest";
import { createCubicBezierPath } from "./createCubicBezierPath";
import type { CubicBezier } from "./types";

describe("createCubicBezierPath", () => {
  it("creates an SVG path from the four Bézier points", () => {
    const bezier: CubicBezier = {
      from: { x: -33, y: -150 },
      fromControlPoint: { x: 117, y: -150 },
      toControlPoint: { x: 568, y: -63 },
      to: { x: 568, y: -213 },
    };

    const path = createCubicBezierPath(bezier);

    expect(path).toBe(
      "M -33 -150 C 117 -150 568 -63 568 -213",
    );
  });
});
