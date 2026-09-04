import {Notice, Plugin, TextFileView} from "obsidian";
import type {CanvasRuntime} from "./interface/canvasRuntime";
import type {CanvasViewWithRuntime} from "./interface/canvasViewWithRuntime";
import {extractNodeBounds} from "./adapter/extractNodeBounds";
import {ANCHOR_MARKER_CLASS, renderAnchorMarkers} from "./ui/renderAnchorMarkers";
import {extractNodeElement} from "./adapter/extractNodeElement";
import type {NodeAnchor} from "./model/nodeAnchor";
const ANCHOR_CURSOR_OVERRIDE_CLASS = "flexible-canvas-anchors__cursor-override";

export default class FlexibleCanvasAnchorsPlugin extends Plugin {
  private readonly anchorMarkers = new Set<HTMLElement>();
  private selectedAnchor: NodeAnchor | null = null;
  private selectedAnchorMarker: HTMLElement | null = null;
  private cursorOverrideTarget: HTMLElement | null = null;

  override onload(): void {
    this.register(() => {
      this.clearAnchorMarkers();
    });

    this.registerDomEvent(
      this.app.workspace.containerEl,
      "pointermove",
      (event) => {
        this.handleAnchorMarkerPointerMove(event);
      },
      { capture: true },
    );

    this.registerDomEvent(
      this.app.workspace.containerEl,
      "pointerdown",
      (event) => {
        this.handleAnchorMarkerPointerDown(event);
      },
      {
        capture: true,
      }
    )

    this.addCommand({
      id: "show-status",
      name: "Show plugin status",
      callback: () => {
        new Notice("The plugin is active.");
      },
    });

    this.addCommand({
      id: "inspect-active-canvas-runtime",
      name: "Inspect active canvas runtime",
      callback: () => {
        const canvas = this.getActiveCanvasRuntime();

        if (!canvas) {
          new Notice("Open a canvas before running this command.");
          return;
        }

        const nodeBounds = Array.from(canvas.nodes.entries()).map((entry) => {
          const nodeId = entry[0];
          const runtimeNode = entry[1];
          return {
            id: nodeId,
            bounds: extractNodeBounds(runtimeNode)
          }
        })

        console.debug("[Flexible Canvas Anchors] Active Canvas runtime", {
          canvas,
          data: canvas.getData(),
          nodes: Array.from(canvas.nodes.entries()),
          edges: Array.from(canvas.edges.entries()),
          nodeBounds,
        });

        new Notice(
          `Canvas runtime: ${canvas.nodes.size} node(s), ${canvas.edges.size} edge(s).`,
        );
      },

    });

    this.addCommand({
      id: "toggle-anchor-markers",
      name: "Toggle anchor markers",
      callback: () => {
        if (this.anchorMarkers.size > 0) {
          this.clearAnchorMarkers();
          new Notice("Anchor markers hidden");
          return;
        }

        const canvas = this.getActiveCanvasRuntime();
        if (!canvas) {
          new Notice("Open a canvas before running showing anchor markers.");
          return;
        }

        let markerCount = 0;

        for (const [nodeId, runtimeNode] of canvas.nodes.entries()) {
          const nodeElement = extractNodeElement(runtimeNode);
          if (!nodeElement) {
            continue;
          }
          const markers = renderAnchorMarkers(nodeElement, nodeId, (anchor, marker) => {
            this.selectAnchor(anchor, marker);
          });

          for (const marker of markers) {
            this.anchorMarkers.add(marker);
            markerCount++;
          }
        }
        new Notice(`${markerCount} anchor marker(s) shown.`);
      }
    })
  }

  private getActiveCanvasRuntime(): CanvasRuntime | null {
    const view = this.app.workspace.getActiveViewOfType(TextFileView);
    if (view?.getViewType() !== "canvas") {
      return null;
    }
    return (view as CanvasViewWithRuntime).canvas ?? null;
  }

  private clearAnchorMarkers(): void {
    this.updateCursorOverride(null);
    for (const marker of this.anchorMarkers) {
      marker.remove();
    }

    this.anchorMarkers.clear();
    this.selectedAnchor = null;
    this.selectedAnchorMarker = null;
  }

  private handleAnchorMarkerPointerDown(event: PointerEvent): void {
    const marker = this.findAnchorMarkerAtPoint(event);

    if (!marker) return;

    event.stopPropagation();

    if (event.target === marker) return;

    event.preventDefault();
    marker.click(); // trigger addEventListener() in renderAnchorMarkers.ts
  }

  private findAnchorMarkerAtPoint(event: PointerEvent): HTMLElement | null {
    const elementsAtPointer =
      this.app.workspace.containerEl.ownerDocument.elementsFromPoint(
        event.clientX,
        event.clientY,
      );

    const marker = elementsAtPointer.find((element) =>
      element.classList.contains(ANCHOR_MARKER_CLASS),
    );

    if (!marker?.instanceOf(HTMLElement)) {
      return null;
    }

    return marker;
  }

  private selectAnchor(anchor: NodeAnchor, marker: HTMLElement): void {
    this.selectedAnchorMarker?.removeClass("is-selected");

    this.selectedAnchor = anchor;
    this.selectedAnchorMarker = marker;

    marker.addClass("is-selected");

    console.debug("[Flexible Canvas Anchors] Selected Anchor", {
      anchor: this.selectedAnchor,
      marker: this.selectedAnchorMarker,
    });
  }

  private handleAnchorMarkerPointerMove(event: PointerEvent): void {
    if (this.anchorMarkers.size === 0) {
      this.updateCursorOverride(null);
      return;
    }

    const marker = this.findAnchorMarkerAtPoint(event);
    const pointerTarget = event.targetNode;

    if (!marker || !pointerTarget?.instanceOf(HTMLElement) || pointerTarget === marker) {
      this.updateCursorOverride(null);
      return;
    }

    this.updateCursorOverride(pointerTarget);
  }

  private updateCursorOverride(target: HTMLElement | null): void {
    if (this.cursorOverrideTarget === target) {
      return;
    }

    this.cursorOverrideTarget?.removeClass(ANCHOR_CURSOR_OVERRIDE_CLASS);

    this.cursorOverrideTarget = target;

    this.cursorOverrideTarget?.addClass(ANCHOR_CURSOR_OVERRIDE_CLASS);
  }
}
