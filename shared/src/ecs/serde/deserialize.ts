import { SerializedScenario } from "shared/src/types";
import { GameWorld } from "../world";
import { addComponent, addEntity, ComponentRef, getWorldComponents } from "bitecs";
import { getComponentName } from "shared/src/utils";
import { Active } from "../components";

const NULLIFY_PROPS = ['cloneOf', 'owner', 'pooledProjectile', 'parent', 'lastCollisionTarget'];
const REASSIGN_EID_PROPS = ['teleportTarget'];

export const instantiateScenario = (scenario: SerializedScenario, world: GameWorld) => {
  const entityMap: Record<number, number> = {}; // OldEid, NewEid
  const compNameMap: Record<string, ComponentRef> = {};
  const allComponents = getWorldComponents(world) as Array<ComponentRef>;

  // 1. Component map pass
  allComponents.forEach((comp) => {
    const compName = getComponentName(comp);
    if (compName) {
      compNameMap[compName] = comp;
    }
  });

  // 2. Entity creation and component assignment pass
  const reassignEntities = new Map<number, {comp: ComponentRef, propName: string, oldEid: number}>();
  scenario.objects.forEach((obj) => {
    const eid = addEntity(world);
    entityMap[obj.eid] = eid;

    obj.components.forEach((comp) => {
      const Component = compNameMap[comp.key];
      addComponent(world, eid, Component);
      const propNames = Object.keys(comp.props);
      propNames.forEach((propName) => {
        if (REASSIGN_EID_PROPS.includes(propName)) {
          reassignEntities.set(eid, {
            comp: Component,
            propName,
            oldEid: obj.eid
          });
        }
        if (NULLIFY_PROPS.includes(propName)) {
          Component[propName][eid] = 0;
        } else {
          const val = comp.props[propName];
          Component[propName][eid] = val;
        }
      })
    });

    addComponent(world, eid, Active);
  });

  // 3. EID reassignment pass
  reassignEntities.forEach(({comp: Component, propName, oldEid}, newEid) => {
    Component[propName][newEid] = entityMap[oldEid];
  })

}