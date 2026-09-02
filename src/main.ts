import {Notice, Plugin, TextFileView} from "obsidian";
import type {CanvasRuntime} from "./interface/canvasRuntime";
import type {CanvasViewWithRuntime} from "./interface/canvasViewWithRuntime";

export default class FlexibleCanvasAnchorsPlugin extends Plugin {
  override onload(): void {
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

        console.debug("[Flexible Canvas Anchors] Active Canvas runtime", {
          canvas,
          data: canvas.getData(),
          nodes: Array.from(canvas.nodes.entries()),
          edges: Array.from(canvas.edges.entries())
        });

        new Notice(
          `Canvas runtime: ${canvas.nodes.size} node(s), ${canvas.edges.size} edge(s).`,
        );
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

}
