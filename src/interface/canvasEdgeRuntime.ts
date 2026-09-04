import type { AnchorSide } from "../geometry/types";

export interface CanvasEdgeEndpointRuntime {
  readonly node: unknown;
  readonly side: AnchorSide;
}

export interface CanvasEdgePathElementRuntime {
  setAttribute(name: string, value: string): void;
}

export interface CanvasEdgePathRuntime {
  readonly interaction: CanvasEdgePathElementRuntime;
  readonly display: CanvasEdgePathElementRuntime;
}

export interface CanvasEdgeLineEndElementRuntime {
  readonly style: {
    transform: string;
  };
}

export interface CanvasEdgeLineEndRuntime {
  readonly el: CanvasEdgeLineEndElementRuntime;
}

export interface CanvasEdgeRuntime {
  readonly id: string;
  readonly from: CanvasEdgeEndpointRuntime;
  readonly to: CanvasEdgeEndpointRuntime;
  readonly path: CanvasEdgePathRuntime;
  readonly bezier: unknown;
  readonly fromLineEnd: CanvasEdgeLineEndRuntime | null;
  readonly toLineEnd: CanvasEdgeLineEndRuntime | null;

  updatePath(): void;
}
