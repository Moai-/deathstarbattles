import { SerializedComponent } from "shared/src/utils";

export type ClickLoc = { x: number; y: number };

export type MenuKind = "select" | "actions" | "addEntity" | "options";

export type InspectWindowState = {
  eid: number;
  entityName: string;
  components: Array<SerializedComponent>;
  x: number;
  y: number;
  collapsed: boolean;
  width?: number;
  height?: number;
};
