import { addComponent, World } from 'bitecs';
import {
  GravityFalloffType,
  HasGravity,
} from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { ObjectTypes } from 'shared/src/types';
import { generateRandomCol, oneIn, randomFromArray } from 'shared/src/utils';
import { createCollidingBase } from './bases';
import { Wormhole } from 'shared/src/ecs/components';

const ANOMALY_RAD = 12;
const NORMAL_GRAV = 60 * 90;

export const createAnomaly = (
  world: World,
  x: number,
  y: number,
  radius: number,
) => {
  const eid = createCollidingBase(world, x, y, radius, ObjectTypes.ANOMALY);

  const vividRange = randomFromArray([
    { r: 155, g: 20, b: 20 },
    { r: 20, g: 155, b: 20 },
    { r: 20, g: 20, b: 155 },
  ]);

  Renderable.col[eid] = generateRandomCol(
    { r: 100, g: 100, b: 100 },
    vividRange,
  );

  addRandomAnomalyEffect(eid, world);

  return eid;
};

export const createRandomAnomaly = (world: World) => {
  return createAnomaly(world, 0, 0, ANOMALY_RAD);
};

const addRandomAnomalyEffect = (eid: number, world: World) => {
  randomFromArray<(eid: number) => void>([
    (eid) => {
      // White hole
      HasGravity.strength[eid] = (ANOMALY_RAD + 20) * 1500 * -1;
    },
    (eid) => {
      // White dwarf
      HasGravity.strength[eid] = (ANOMALY_RAD + 20) * 1500;
      maybeHole(eid, world);
    },
    (eid) => {
      // Heavy object
      HasGravity.strength[eid] = NORMAL_GRAV * 3;
      maybeHole(eid, world);
    },
    (eid) => {
      // Normal object
      HasGravity.strength[eid] = NORMAL_GRAV;
      maybeHole(eid, world);
    },
    (eid) => {
      // Light object
      HasGravity.strength[eid] = NORMAL_GRAV / 3;
      maybeHole(eid, world);
    },
    (eid) => {
      // Linear acceleration
      HasGravity.strength[eid] = Phaser.Math.Between(50, 150);
      HasGravity.falloffType[eid] = GravityFalloffType.LINEAR;
      maybeHole(eid, world);
    },
    (eid) => {
      // Heavy object inverse
      HasGravity.strength[eid] = -NORMAL_GRAV * 3;
    },
    (eid) => {
      // Normal object inverse
      HasGravity.strength[eid] = -NORMAL_GRAV;
    },
    (eid) => {
      // Light object inverse
      HasGravity.strength[eid] = -NORMAL_GRAV / 3;
    },
  ])(eid);
};

const maybeHole = (eid: number, world: World) => {
  if (oneIn(2)) {
    addComponent(world, eid, Wormhole);
  }
};
