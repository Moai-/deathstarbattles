import { World, getAllEntities, getEntityComponents, hasComponent } from "bitecs";
import { Backgrounds, ObjectTypes, SerializedEntity, SerializedScenario } from "shared/src/types";
import { isTypedArray, getComponentName } from "shared/src/utils";
import { GameWorld } from "../world";
import { Active, ObjectInfo } from "../components";

export const serializeComponentSoA = (component: any, eid: number) => {
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
    if (key === 'Object Info') {
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

const IGNORE_OBJECT_TYPES = [ObjectTypes.DEATHBEAM, ObjectTypes.DEATHSTAR];
const IGNORE_COMPONENTS = ['Active'];

export const serializeScenario = (world: GameWorld, background: Backgrounds, name: string) => {
  const allEntities = getAllEntities(world);
  const objects: Array<SerializedEntity> = [];
  allEntities.forEach((eid) => {
    if (!hasComponent(world, eid, Active)) {
      return;
    }
    if (hasComponent(world, eid, ObjectInfo)) {
      if (IGNORE_OBJECT_TYPES.includes(ObjectInfo.type[eid])) {
        return;
      }
    }
    const {components} = serializeComponents(world, eid);
    const filteredComponents = components.filter((c) => !IGNORE_COMPONENTS.includes(c.key));
    objects.push({
      eid,
      components: filteredComponents
    })
  })
  return {
    name,
    background,
    objects,
  } as SerializedScenario;
}