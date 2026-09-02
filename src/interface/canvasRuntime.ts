export interface CanvasRuntime {
  readonly nodes: ReadonlyMap<string, unknown>;
  readonly edges: ReadonlyMap<string, unknown>;
  getData(): unknown;
}
