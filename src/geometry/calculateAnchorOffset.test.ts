import {describe, expect, it} from "vitest";
import {NodeBounds} from "./types";
import { calculateAnchorOffset } from "./calculateAnchorOffset";

describe("calculateAnchorOffset", () => {
  it('calculates the movement from the native anchor to the selected anchor ', () => {
    const bounds: NodeBounds = {
      x: 280,
      y: -580,
      width: 360,
      height: 360,
    }

    const offset = calculateAnchorOffset(
      bounds,
      {side: "bottom", ratio: 0.5},
      {side: "bottom", ratio: 0.8},
    );

    expect(offset).toEqual({
      x: 108,
      y:0
    })
  });
})
