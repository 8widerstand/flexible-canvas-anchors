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
