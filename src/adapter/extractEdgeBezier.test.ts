import { describe, expect, it } from "vitest";
import { extractEdgeBezier } from "./extractEdgeBezier";

describe("extractEdgeBezier", () => {
  it("maps the runtime Bézier points to our geometry model", () => {
    const runtimeEdge = {
      bezier: {
        from: { x: -33, y: -150 },
        cp1: { x: 117, y: -150 },
        cp2: { x: 460, y: -63 },
        to: { x: 460, y: -213 },
      },
    };

    const bezier = extractEdgeBezier(runtimeEdge);

    expect(bezier).toEqual({
      from: { x: -33, y: -150 },
      fromControlPoint: { x: 117, y: -150 },
      toControlPoint: { x: 460, y: -63 },
      to: { x: 460, y: -213 },
    });
  });

  it("returns null when the runtime edge has no Bézier data", () => {
    const bezier = extractEdgeBezier({});

    expect(bezier).toBeNull();
  });

  it("returns null when a Bézier point is invalid", () => {
    const runtimeEdge = {
      bezier: {
        from: { x: "incorrect", y: -150 },
        cp1: { x: 117, y: -150 },
        cp2: { x: 460, y: -63 },
        to: { x: 460, y: -213 },
      },
    };

    const bezier = extractEdgeBezier(runtimeEdge);

    expect(bezier).toBeNull();
  });
});
