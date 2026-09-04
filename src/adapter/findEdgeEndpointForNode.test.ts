import { describe, expect, it } from "vitest";
import { findEdgeEndpointForNode } from "./findEdgeEndpointForNode";

describe("findEdgeEndpointForNode", () => {
  it("returns to when the node is the edge target", () => {
    const runtimeEdge = {
      from: {
        node: { id: "source-node" },
      },
      to: {
        node: { id: "target-node" },
      },
    };

    const endpoint = findEdgeEndpointForNode(
      runtimeEdge,
      "target-node",
    );

    expect(endpoint).toBe("to");
  });

  it("returns from when the node is the edge source", () => {
    const runtimeEdge = {
      from: {
        node: { id: "source-node" },
      },
      to: {
        node: { id: "target-node" },
      },
    };

    const endpoint = findEdgeEndpointForNode(
      runtimeEdge,
      "source-node",
    );

    expect(endpoint).toBe("from");
  });

  it("returns null when the node is not connected to the edge", () => {
    const runtimeEdge = {
      from: {
        node: { id: "source-node" },
      },
      to: {
        node: { id: "target-node" },
      },
    };

    const endpoint = findEdgeEndpointForNode(
      runtimeEdge,
      "another-node",
    );

    expect(endpoint).toBeNull();
  });

  it("returns null when the runtime edge is invalid", () => {
    const endpoint = findEdgeEndpointForNode(
      null,
      "target-node",
    );

    expect(endpoint).toBeNull();
  });
});
