import {Notice, Plugin, TextFileView} from "obsidian";
import type {CanvasRuntime} from "./interface/canvasRuntime";
import type {CanvasViewWithRuntime} from "./interface/canvasViewWithRuntime";
import {extractNodeBounds} from "./adapter/extractNodeBounds";
import {renderAnchorMarkers} from "./ui/renderAnchorMarkers";
import {extractNodeElement} from "./adapter/extractNodeElement";

export default class FlexibleCanvasAnchorsPlugin extends Plugin {
  private readonly anchorMarkers = new Set<HTMLElement>();

  override onload(): void {
    this.register(() => {
      this.clearAnchorMarkers();
    });

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
      id: "toggle-read-only-anchor-markers",
      name: "Toggle read-only anchor markers",
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

        for (const runtimeNode of canvas.nodes.values()) {
         const nodeElement = extractNodeElement(runtimeNode);
         if(!nodeElement) {
           continue;
         }
         const markers = renderAnchorMarkers(nodeElement);

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
    for (const marker of this.anchorMarkers) {
      marker.remove();
    }

    this.anchorMarkers.clear();
  }

}
