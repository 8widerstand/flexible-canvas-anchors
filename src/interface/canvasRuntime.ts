import {CanvasPersistenceRuntime} from "./canvasPersistenceRuntime";

export interface CanvasRuntime extends CanvasPersistenceRuntime {
  readonly nodes: ReadonlyMap<string, unknown>;
  readonly edges: ReadonlyMap<string, unknown>;
  getData(): unknown;
}
