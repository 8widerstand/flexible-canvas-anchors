import {describe, expect, it, vi} from "vitest";
import {renderEdgeWithAnchor, renderEdgeWithAnchors} from "./renderEdgeWithAnchor";

describe("renderEdgeWithAnchor", () => {
  it("writes the translated path to both SVG path layers", () => {
    const {
      runtimeEdge,
      interactionSetAttribute,
      displaySetAttribute,
    } = createRuntimeEdge();

    const rendered = renderEdgeWithAnchor(
      runtimeEdge,
      {
        nodeId: "target-node",
        position: {
          side: "bottom",
          ratio: 0.8,
        },
      },
    );

    const expectedPath =
      "M 0 0 L 7 0 " +
      "M 7 0 C 100 0 280 150 280 207 " +
      "M 280 207 L 280 200";

    expect(rendered).toBe(true);

    expect(interactionSetAttribute).toHaveBeenCalledWith(
      "d",
      expectedPath,
    );

    expect(displaySetAttribute).toHaveBeenCalledWith(
      "d",
      expectedPath,
    );
  });

  it("writes both translated endpoints to both SVG path layers", () => {
    const {
      runtimeEdge,
      interactionSetAttribute,
      displaySetAttribute,
    } = createRuntimeEdge();

    const rendered = renderEdgeWithAnchors(
      runtimeEdge,
      [
        {
          nodeId: "source-node",
          position: {
            side: "right",
            ratio: 0.2,
          },
        },
        {
          nodeId: "target-node",
          position: {
            side: "bottom",
            ratio: 0.8,
          },
        },
      ],
    );

    const expectedPath =
      "M 0 -30 L 7 -30 " +
      "M 7 -30 C 100 -30 280 150 280 207 " +
      "M 280 207 L 280 200";

    expect(rendered).toBe(true);

    expect(interactionSetAttribute).toHaveBeenCalledWith(
      "d",
      expectedPath,
    );

    expect(displaySetAttribute).toHaveBeenCalledWith(
      "d",
      expectedPath,
    );
  });
});

function createRuntimeEdge() {
  const interactionSetAttribute = vi.fn();
  const displaySetAttribute = vi.fn();

  const runtimeEdge = {
    id: "edge-1",
    from: {
      node: {
        id: "source-node",
        x: -100,
        y: -50,
        width: 100,
        height: 100,
      },
      side: "right",
    },
    to: {
      node: {
        id: "target-node",
        x: 200,
        y: 100,
        width: 100,
        height: 100,
      },
      side: "bottom",
    },
    path: {
      interaction: {
        setAttribute: interactionSetAttribute,
      },
      display: {
        setAttribute: displaySetAttribute,
      },
    },
    bezier: {
      from: {x: 7, y: 0},
      cp1: {x: 100, y: 0},
      cp2: {x: 250, y: 150},
      to: {x: 250, y: 207},
    },
    fromLineEnd: null,
    toLineEnd: null,
    getData: () => ({
      id: "edge-1",
    }),
    setData: () => undefined,
    updatePath: () => undefined,
  };

  return {
    runtimeEdge,
    interactionSetAttribute,
    displaySetAttribute,
  };
}
