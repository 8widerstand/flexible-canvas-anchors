import {CubicBezier} from "./types";

export function createCubicBezierPath(bezier: CubicBezier,): string {
  return [
    `M ${bezier.from.x} ${bezier.from.y}`,
    `C ${bezier.fromControlPoint.x} ${bezier.fromControlPoint.y}`,
    `${bezier.toControlPoint.x} ${bezier.toControlPoint.y}`,
    `${bezier.to.x} ${bezier.to.y}`,
  ].join(" ");
}
