import {AnchorSide} from "../geometry/types";

const ANCHOR_SIDES: AnchorSide[] = ["top", "left", "right", "bottom"]
const ANCHORS_RATIO: number[] = [0.2, 0.5, 0.8]

export function renderAnchorMarkers(nodeElement: HTMLElement): HTMLElement[] {
  const markers: HTMLElement[] = [];
  for (const side of ANCHOR_SIDES) {
    for (const ratio of ANCHORS_RATIO) {
      const marker = nodeElement.createDiv({
        cls: "flexible-canvas-anchors__marker",
      });

      marker.dataset.side = side;
      marker.style.setProperty("--flexible-canvas-anchors-ratio",  `${ratio * 100}%`);
      marker.setAttribute("aria-hidden", "true");
      markers.push(marker);
    }
  }
  return markers;
}
