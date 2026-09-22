import { describe, expect, it } from "vitest";
import { extractPersistedNodeAnchors } from "./extractPersistedNodeAnchors";

describe("extractPersistedNodeAnchors", () => {
  it("creates a target node anchor from persisted edge data", () => {
    const edgeData = {
      fromNode: "source-node",
      fromSide: "right",
      toNode: "target-node",
      toSide: "bottom",
      flexibleCanvasAnchors: {
        version: 1,
        to: {
          ratio: 0.2,
        },
      },
    };

    const anchors = extractPersistedNodeAnchors(edgeData);

    expect(anchors).toEqual([
      {
        nodeId: "target-node",
        position: {
          side: "bottom",
          ratio: 0.2,
        },
      },
    ]);
  });

  it("creates a source node anchor from persisted edge data", () => {
    const edgeData = {
      fromNode: "source-node",
      fromSide: "right",
      toNode: "target-node",
      toSide: "bottom",
      flexibleCanvasAnchors: {
        version: 1,
        from: {
          ratio: 0.8,
        },
      },
    };

    const anchors = extractPersistedNodeAnchors(edgeData);

    expect(anchors).toEqual([
      {
        nodeId: "source-node",
        position: {
          side: "right",
          ratio: 0.8,
        },
      },
    ]);
  });
});
