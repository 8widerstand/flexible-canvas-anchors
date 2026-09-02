import type {AnchorPosition, NodeBounds, Point} from "./types";

const MIN_ANCHOR_RATIO = 0;
const MAX_ANCHOR_RATIO = 1;

export function calculateAnchorPoint(
  bounds: NodeBounds,
  anchor: AnchorPosition,
): Point {
  assertValidAnchorRatio(anchor.ratio);

  switch (anchor.side) {
    case "top":
      return {
        x: bounds.x + bounds.width * anchor.ratio,
        y: bounds.y,
      };

    case "right":
      return {
        x: bounds.x + bounds.width,
        y: bounds.y + bounds.height * anchor.ratio,
      };

    case "bottom":
      return {
        x: bounds.x + bounds.width * anchor.ratio,
        y: bounds.y + bounds.height,
      };

    case "left":
      return {
        x: bounds.x,
        y: bounds.y + bounds.height * anchor.ratio,
      };
  }
}


function assertValidAnchorRatio(ratio: number): void {
  if (!Number.isFinite(ratio) || ratio > MAX_ANCHOR_RATIO || ratio < MIN_ANCHOR_RATIO) {
    throw new RangeError(
      `Anchor ratio must be a finite number between 0 and 1. Received: ${ratio}`,
    );
  }
}
