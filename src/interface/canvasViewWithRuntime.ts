import {CanvasRuntime} from "./canvasRuntime";
import {TextFileView} from "obsidian";

export interface CanvasViewWithRuntime extends TextFileView {
  readonly canvas?: CanvasRuntime;
}
