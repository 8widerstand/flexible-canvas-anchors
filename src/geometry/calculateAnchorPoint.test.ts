import {describe, expect, it} from "vitest";
import {NodeBounds} from "./types";
import {calculateAnchorPoint} from "./calculateAnchorPoint";

describe("calculateAnchorPoint", () => {
  const bounds: NodeBounds = {
    x: 10,
    y: 20,
    width: 100,
    height: 200
  };

  it('calculates a point on the top side ', () => {
    const point = calculateAnchorPoint(bounds, {
      side: "top",
      ratio: 0.2,
    });

    expect(point).toEqual({x: 30, y: 20})
  });

  it('calculates a point on the bottom side ', () => {
    const point = calculateAnchorPoint(bounds, {
      side: "bottom",
      ratio: 0.2,
    });
    expect(point).toEqual({x: 30, y: 220})
  })

  it('calculates a point on the right side ', () => {
    const point = calculateAnchorPoint(bounds, {
      side:"right",
      ratio: 0.2,
    });
    expect(point).toEqual({x: 110, y: 60})
  });

  it('calculates a point on the left side ', () => {
    const point = calculateAnchorPoint(bounds, {
      side: "left",
      ratio: 0.2,
    });
    expect(point).toEqual({x: 10, y: 60});
  });

  it.each([
    -0.01,
    1.01,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])("rejects the invalid ratio %s", (ratio) => {
    expect(() => {
      calculateAnchorPoint(bounds, {
        side: "top",
        ratio,
      });
    }).toThrow(RangeError);
  });

  it.each([
    [0, { x: 10, y: 20 }],
    [1, { x: 110, y: 20 }],
  ])("accepts the boundary ratio %s", (ratio, expectedPoint) => {
    const point = calculateAnchorPoint(bounds, {
      side: "top",
      ratio,
    });

    expect(point).toEqual(expectedPoint);
  });

})
