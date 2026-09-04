import { describe, expect, it } from "vitest";
import { isCanvasEdgeRuntime } from "./isCanvasEdgeRuntime";

describe("isCanvasEdgeRuntime", () => {
  it("accepts an object containing the required edge properties", () => {
    const runtimeEdge = {
      id: "edge-1",
      from: {
        node: { id: "source-node" },
        side: "right",
      },
      to: {
        node: { id: "target-node" },
        side: "bottom",
      },
      path: {
        interaction: {
          setAttribute: () => undefined,
        },
        display: {
          setAttribute: () => undefined,
        },
      },
      bezier: {},
      fromLineEnd: null,
      toLineEnd: {
        el: {
          style: {
            transform: "translate(460px, -220px) rotate(0deg)",
          },
        },
      },
      updatePath: () => undefined,
    };

    const result = isCanvasEdgeRuntime(runtimeEdge);

    expect(result).toBe(true);
  });

  it("rejects an object missing the required edge properties", () => {
    const result = isCanvasEdgeRuntime({});

    expect(result).toBe(false);
  });
});
