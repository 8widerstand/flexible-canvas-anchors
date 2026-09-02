import { Notice, Plugin } from "obsidian";

export default class FlexibleCanvasAnchorsPlugin extends Plugin {
  override onload(): void {
    this.addCommand({
      id: "show-status",
      name: "Show plugin status",
      callback: () => {
        new Notice("The plugin is active.");
      },
    });
  }
}
