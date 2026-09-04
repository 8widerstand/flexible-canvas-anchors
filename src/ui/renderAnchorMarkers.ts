import {AnchorSide} from "../geometry/types";
import type {NodeAnchor} from "../model/nodeAnchor";

export const ANCHOR_MARKER_CLASS = "flexible-canvas-anchors__marker";
const ANCHOR_SIDES: AnchorSide[] = ["top", "left", "right", "bottom"]
const ANCHORS_RATIO: number[] = [0.2, 0.5, 0.8]

type AnchorMarkerSelectHandler = (
  anchor: NodeAnchor,
  marker: HTMLElement
) => void;

export function renderAnchorMarkers(
  nodeElement: HTMLElement,
  nodeId: string,
  onSelect: AnchorMarkerSelectHandler
): HTMLElement[] {
  const markers: HTMLElement[] = [];
  for (const side of ANCHOR_SIDES) {
    for (const ratio of ANCHORS_RATIO) {
      const marker = nodeElement.createEl("button", {
        cls: ANCHOR_MARKER_CLASS,
        attr: {
          type: "button",
          "aria-label": `Select ${side} anchor at ${ratio * 100}%`,
        },
      });

      marker.dataset.side = side;
      marker.style.setProperty("--flexible-canvas-anchors-ratio", `${ratio * 100}%`);
      markers.push(marker);

      marker.addEventListener("click", (event) => {
        event.stopPropagation();
        onSelect(
          {
            nodeId,
            position:{side,ratio},
          },
          marker
        )});
    }

  }
  return markers;
}
