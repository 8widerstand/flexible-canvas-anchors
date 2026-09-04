import {describe, expect, it} from "vitest";
import type {CubicBezier} from "./types";
import { translateBezierEndpoint } from "./translateBezierEndpoint";

describe("translateBezierEndpoint", () => {
  it("moves the target point and its control point", () => {
    const bezier: CubicBezier = {
      from: { x: -33, y: -150 },
      fromControlPoint: { x: 117, y: -150 },
      toControlPoint: { x: 460, y: -63 },
      to: { x: 460, y: -213 },
    };

    const translatedBezier = translateBezierEndpoint(
      bezier,
      "to",
      { x: 108, y: 0 },
    );

    expect(translatedBezier).toEqual({
      from: { x: -33, y: -150 },
      fromControlPoint: { x: 117, y: -150 },
      toControlPoint: { x: 568, y: -63 },
      to: { x: 568, y: -213 },
    });
  });

  it("moves the source point and its control point", () => {
    const bezier: CubicBezier = {
      from: { x: -33, y: -150 },
      fromControlPoint: { x: 117, y: -150 },
      toControlPoint: { x: 460, y: -63 },
      to: { x: 460, y: -213 },
    };

    const translatedBezier = translateBezierEndpoint(
      bezier,
      "from",
      { x: 0, y: -120 },
    );

    expect(translatedBezier).toEqual({
      from: { x: -33, y: -270 },
      fromControlPoint: { x: 117, y: -270 },
      toControlPoint: { x: 460, y: -63 },
      to: { x: 460, y: -213 },
    });
  });

});
