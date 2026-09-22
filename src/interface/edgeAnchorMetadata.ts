import type { PersistedEdgeAnchor } from "./persistedEdgeAnchor";

export interface EdgeAnchorMetadata {
  readonly version: 1;
  readonly from?: PersistedEdgeAnchor;
  readonly to?: PersistedEdgeAnchor;
}
