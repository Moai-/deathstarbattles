import {
  getEntityComponents,
  type World,
} from "bitecs";
import { ObjectTypes } from "../types";

export const COMPONENT_NAME = Symbol.for("bitecs.componentName");

export function nameComponent<T extends object>(component: T, name: string): T {
  Object.defineProperty(component, COMPONENT_NAME, {
    value: name,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  return component;
}

export function getComponentName(component: object): string | undefined {
  return (component as any)[COMPONENT_NAME];
}

export type SerializedComponent = {
  key: string;
  props: unknown;
};

export type SerializedEntity = {
  eid: number;
  name: string;
  components: SerializedComponent[];
};

function isTypedArray(v: any): v is ArrayBufferView {
  return ArrayBuffer.isView(v) && !(v instanceof DataView);
}

const serializeComponentSoA = (component: any, eid: number) => {
  const out: Record<string, any> = {};
  for (const key of Object.keys(component)) {
    const store = component[key];
    if (store && (Array.isArray(store) || isTypedArray(store))) {
      out[key] = (store as Array<number>)[eid];
    }
  }
  return out;
}

export function serializeComponents(world: World, eid: number) {
  const comps = getEntityComponents(world, eid);
  let entityName = `${eid}: Entity`;
  const components = comps.map((c) => {
    const key = getComponentName(c) ?? (c as any).__name ?? "UnknownComponent";
    if (key === 'ObjectInfo') {
      const renderType = (c as {type: Array<number>}).type[eid];
      entityName = `${eid}: ${ObjectTypes[renderType]}`;
    }
    return {
      key,
      props: serializeComponentSoA(c as any, eid),
    }
  });
  return {
    eid,
    name: entityName,
    components,
  };
}