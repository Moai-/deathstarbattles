import { addComponent, addEntity } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { RenderableTypes } from '../render/types';
import { GameWorld } from 'shared/src/ecs/world';
import { Wormhole } from 'shared/src/ecs/components/wormhole';

const MIN_STAR_RAD = 30;
const MAX_STAR_RAD = 80;

export const createWormhole = (
  world: GameWorld,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Collision, eid);
  addComponent(world, Renderable, eid);
  addComponent(world, HasGravity, eid);
  addComponent(world, Wormhole, eid);

  const timeSeed = Math.floor(Date.now() / 5000);
  const rng = mulberry32(timeSeed);
  const biasIndex = Math.floor(rng() * biases.length);

  const bias = biases[biasIndex];

  Position.x[eid] = x;
  Position.y[eid] = y;
  Collision.radius[eid] = radius;
  HasGravity.strength[eid] = radius * 50;
  Renderable.type[eid] = RenderableTypes.WORMHOLE;
  Renderable.col[eid] = generateWormholeColWithBias(bias, timeSeed);

  return eid;
};

export const createRandomWormhole = (world: GameWorld) => {
  const radius = Phaser.Math.Between(MIN_STAR_RAD, MAX_STAR_RAD);
  return createWormhole(world, 0, 0, radius);
};

const biases = ['R', 'G', 'B', 'RG', 'RB', 'GB'] as const;
type Bias = (typeof biases)[number];

const mulberry32 = (seed: number) => {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const generateWormholeColWithBias = (bias: Bias, seed: number) => {
  const base = 20;
  const bright = 220;

  console.log('generate with bias', bias);

  // Use seeded randomness
  const rng = mulberry32(seed);
  const rand = () => Math.floor(rng() * 20);

  const r = (bias.includes('R') ? bright : base) + rand();
  const g = (bias.includes('G') ? bright : base) + rand();
  const b = (bias.includes('B') ? bright : base) + rand();

  return (r << 16) | (g << 8) | b;
};
