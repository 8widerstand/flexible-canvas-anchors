import type { AnchorPosition } from "../geometry/types";

export interface NodeAnchor {
  readonly nodeId: string;
  readonly position: AnchorPosition;
}
