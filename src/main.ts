import {Notice, Plugin, TextFileView} from "obsidian";
import type {CanvasRuntime} from "./interface/canvasRuntime";
import type {CanvasViewWithRuntime} from "./interface/canvasViewWithRuntime";
import {extractNodeBounds} from "./adapter/extractNodeBounds";
import {ANCHOR_MARKER_CLASS, renderAnchorMarkers} from "./ui/renderAnchorMarkers";
import {extractNodeElement} from "./adapter/extractNodeElement";
import type {NodeAnchor} from "./model/nodeAnchor";
import {renderEdgeWithAnchor} from "./adapter/renderEdgeWithAnchor";
import {installEdgeUpdatePathHook} from "./adapter/installEdgeUpdatePathHook";
import {isCanvasEdgeRuntime} from "./adapter/isCanvasEdgeRuntime";
import {findEdgeEndpointForNode} from "./adapter/findEdgeEndpointForNode";
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
    });

    this.addCommand({
      id: "apply-selected-anchor-to-connected-edge",
      name: "Apply selected anchor to connected edge",
      callback: () => {
        const anchor = this.selectedAnchor;

        if (anchor === null) {
          new Notice("Select an anchor marker first.");
          return;
        }

        const canvas = this.getActiveCanvasRuntime();

        if (canvas === null) {
          new Notice("Open a canvas before applying an anchor.");
          return;
        }

        const connectedEdges = Array.from(canvas.edges.values()).filter(
          (edge) => findEdgeEndpointForNode(edge, anchor.nodeId) !== null,);

        if (connectedEdges.length !== 1) {
          new Notice(`This experiment requires exactly one connected edge. Found: ${connectedEdges.length}.`);
          return;
        }

        const edge = connectedEdges[0];

        if (edge === undefined || !isCanvasEdgeRuntime(edge)) {
          new Notice("The connected edge runtime is unavailable.");
          return;
        }

        this.clearEdgeAnchorOverride();

        let anchorApplied = false;

        const cleanup = installEdgeUpdatePathHook(edge,
          () => {
            anchorApplied = renderEdgeWithAnchor(
              edge,
              anchor,
            );
          },
        );

        if (!anchorApplied) {
          cleanup();

          new Notice("Could not apply the anchor. For this experiment, select a marker on the edge's current side.",);
          return;
        }

        this.edgeAnchorOverrideCleanup = cleanup;

        new Notice(`Anchor applied at ${Math.round(anchor.position.ratio * 100)}%.`);
      },
    });
  }

  private getActiveCanvasRuntime(): CanvasRuntime | null {
    const view = this.app.workspace.getActiveViewOfType(TextFileView);
    if (view?.getViewType() !== "canvas") {
      return null;
    }
    return (view as CanvasViewWithRuntime).canvas ?? null;
  }

  private clearAnchorMarkers(): void {
    this.clearEdgeAnchorOverride();
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

  private clearEdgeAnchorOverride(): void {
    const cleanup = this.edgeAnchorOverrideCleanup;

    this.edgeAnchorOverrideCleanup = null;
    cleanup?.();
  }

  private edgeAnchorOverrideCleanup: (() => void) | null = null;
}
