export type AnchorSide = "top" | "right" | "bottom" | "left";

export interface NodeBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface AnchorPosition {
  readonly side: AnchorSide;
  readonly ratio: number;
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface CubicBezier {
  readonly from: Point;
  readonly fromControlPoint: Point;
  readonly toControlPoint: Point;
  readonly to: Point;
}

export type BezierEndpoint = "from" | "to";
