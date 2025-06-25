import {
  createWorld,
  addEntity,
  hasComponent,
  addComponent,
  ISchema,
  ComponentType,
  IWorld,
} from 'bitecs';
import { cloneComponent } from 'shared/src/ecs/componentFactory';
import { AllComponents, allComponents } from 'shared/src/ecs/components';

type CloneOf<T> = T extends ComponentType<infer S> ? ComponentType<S> : never;

type Cloned<CMap, Keys extends keyof CMap> = {
  [P in keyof CMap]: P extends Keys ? CloneOf<CMap[P]> : CMap[P];
};

const makeCloneComponents = <Keys extends readonly (keyof AllComponents)[]>(
  toClone: Keys,
): Cloned<AllComponents, Keys[number]> => {
  const cloned: Partial<Record<keyof AllComponents, ComponentType<ISchema>>> = {
    ...allComponents,
  };

  for (const key of toClone) {
    cloned[key] = cloneComponent(allComponents[key]);
  }

  return cloned as Cloned<AllComponents, Keys[number]>;
};

export function buildSnapshot(
  eids: number[],
  componentsToClone: Array<keyof AllComponents>,
  oldWorld: IWorld,
) {
  const world = createWorld();
  const clonedComponents = makeCloneComponents(componentsToClone);
  const mapMainToSnap = new Map<number, number>();

  for (const srcEid of eids) {
    const dstEid = addEntity(world);
    mapMainToSnap.set(srcEid, dstEid);

    // copy the data we care about
    for (const rawKey in allComponents) {
      const key = rawKey as keyof AllComponents;
      if (!componentsToClone.includes(key)) {
        // Skip components we don't need
        continue;
      }
      const SrcComp = allComponents[key];
      if (hasComponent(oldWorld, SrcComp, srcEid)) {
        // If this source entity has this component in the old world, copy it onto the clone
        const DstComp = clonedComponents[key];
        addComponent(world, DstComp, dstEid);

        for (const field in SrcComp) {
          // Copy old component data field by field to the cloned component
          // @ts-expect-error -- ts can't properly distinguish in-component types
          DstComp[field][dstEid] = SrcComp[field][srcEid];
        }
      }
    }
  }

  return {
    world,
    comps: clonedComponents,
    cloneMap: mapMainToSnap,
  };
}
