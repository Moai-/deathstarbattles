import {
  // addComponent,
  addEntity,
  ComponentRef,
  createWorld,
  entityExists,
  getWorldComponents,
  registerComponents,
  resetWorld,
} from 'bitecs';
import { GameWorld, RandomFn, WeightedChoice, WorldRandomApi} from '../types';
import { NULL_ENTITY } from '../consts';
import seedrandom from 'seedrandom';
import { rgb } from '../utils';


export const createGameWorld = (components: Array<ComponentRef>, seed?: string | number) => {
  const world = createWorld() as GameWorld;
  world.time = 0;
  world.delta = 0;
  world.movements = null;
  world.traceBuffer = null;
  world.traceBufferIdx = 0;
  registerComponents(world, components);
  initializeWorldRandom(world, seed);
  // make sure NULL_ENTITY exists
  // This is the ECS equivalent of null, do not add components to this
  if (!entityExists(world, NULL_ENTITY)) {
    addEntity(world);
  }
  return world;
};

export const clearWorld = (world: GameWorld) => {
  resetWorld(world);
  world.time = 0;
  world.delta = 0;
  world.movements = null;
  world.traceBuffer = null;
  world.traceBufferIdx = 0;
  getWorldComponents(world).forEach((comp) => {
    const props = Object.keys(comp);
    props.forEach((prop) => {
      (comp[prop] as Float32Array).fill(0);
    })
  });
  initializeWorldRandom(world, world.seed);
}

export { NULL_ENTITY };

export const createWorldRandomApi = (rng: RandomFn): WorldRandomApi => {
  return {
    rnd: () => rng(),
    
    between: (min: number, max: number) => {
      const low = Math.ceil(Math.min(min, max));
      const high = Math.floor(Math.max(min, max));

      if (high < low) {
        throw new Error(`world.random.between received invalid range: ${min}, ${max}`);
      }

      return Math.floor(rng() * (high - low + 1)) + low;
    },

    betweenFloat: (min: number, max: number) => {
      const low = Math.min(min, max);
      const high = Math.max(min, max);

      return rng() * (high - low) + low;
    },

    jitter: (base, max) => {
      const range = Math.floor(Math.max(0, max));
      const offset = Math.floor(rng() * (range * 2 + 1)) - range;
      return base + offset;
    },

    jitterFloat: (base: number, max: number) => {
      return base + (rng() * 2 - 1) * max;
    },

    oneIn: (fraction: number) => {
      if (!Number.isFinite(fraction) || fraction <= 0) {
        throw new Error(`world.random.oneIn requires a positive number, got: ${fraction}`);
      }

      return rng() < 1 / fraction;
    },

    pickElement: <T>(array: ReadonlyArray<T>) => {
      if (array.length === 0) {
        throw new Error('world.random.pickRandom cannot pick from an empty array');
      }

      const index = Math.floor(rng() * array.length);
      return array[index];
    },

    pickChance: <T>(chances: ReadonlyArray<WeightedChoice<T>>) => {
      const entries = chances.flatMap((obj) =>
        Object.entries(obj).map(([k, v]) => [Number(k), v] as [number, T])
      );
      if (entries.length === 0) {
        throw new Error('world.random.pickChance cannot pick from an empty table');
      }

      const totalWeight = entries.reduce((sum, [w]) => sum + w, 0);

      if (totalWeight <= 0) {
        throw new Error('world.random.pickChance requires total weight > 0');
      }

      let r = rng() * totalWeight;

      for (const [weight, value] of entries) {
        if (!Number.isFinite(weight) || weight < 0) {
          throw new Error(`world.random.pickChance received invalid weight: ${weight}`);
        }

        r -= weight;
        if (r <= 0) {
          return value;
        }
      }

      return entries[entries.length -1][1]
    },

    colour: (base, bias) => {
      const r = base.r + Math.floor(rng() * bias.r);
      const g = base.g + Math.floor(rng() * bias.g);
      const b = base.b + Math.floor(rng() * bias.b);
    
      return rgb(r, g, b)
    }
  };
};

const initializeWorldRandom = (world: GameWorld, seed?: string | number) => {
  world.seed = seed;

  const rng: RandomFn =
    seed === undefined || seed === null
      ? Math.random
      : seedrandom(String(seed));

  world.rng = rng;
  world.random = createWorldRandomApi(rng);
};

export type { GameWorld };
