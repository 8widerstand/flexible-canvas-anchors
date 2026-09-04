import type {AnchorPosition, NodeBounds, Point} from "./types";
import {calculateAnchorPoint} from "./calculateAnchorPoint";


export function calculateAnchorOffset(
  bounds: NodeBounds,
  currentAnchor: AnchorPosition,
  targetAnchor: AnchorPosition
) : Point {
  const currentPoint = calculateAnchorPoint(bounds, currentAnchor);
  const targetPoint = calculateAnchorPoint(bounds, targetAnchor);
  return {
    x: targetPoint.x - currentPoint.x,
    y: targetPoint.y - currentPoint.y,
  }
}
