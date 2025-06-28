import { addComponent, IWorld } from 'bitecs';
import {
  GravityFalloffType,
  HasGravity,
} from 'shared/src/ecs/components/hasGravity';
import { Renderable } from '../render/components/renderable';
import { ObjectTypes } from 'shared/src/types';
import { generateRandomCol, randomFromArray } from 'shared/src/utils';
import { createCollidingBase } from './bases';
import { Wormhole } from 'shared/src/ecs/components';

const ANOMALY_RAD = 12;
const NORMAL_GRAV = 60 * 90;

export const createAnomaly = (
  world: IWorld,
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

const addRandomAnomalyEffect = (eid: number, world: IWorld) => {
  randomFromArray<(eid: number) => void>([
    (eid) => {
      // White hole
      HasGravity.strength[eid] = (ANOMALY_RAD + 20) * 1500 * -1;
    },
    (eid) => {
      // White dwarf
      HasGravity.strength[eid] = (ANOMALY_RAD + 20) * 1500;
    },
    (eid) => {
      // Wormhole
      HasGravity.strength[eid] = NORMAL_GRAV;
      addComponent(world, Wormhole, eid);
    },
    (eid) => {
      // Supergiant
      HasGravity.strength[eid] = Phaser.Math.Between(50, 150);
      HasGravity.falloffType[eid] = GravityFalloffType.LINEAR;
    },
    (eid) => {
      // Normal object
      HasGravity.strength[eid] = NORMAL_GRAV;
    },
    (eid) => {
      // Heavy object
      HasGravity.strength[eid] = NORMAL_GRAV * 3;
    },
    (eid) => {
      // Light object
      HasGravity.strength[eid] = NORMAL_GRAV / 3;
    },
  ])(eid);
};

export const createRandomAnomaly = (world: IWorld) => {
  return createAnomaly(world, 0, 0, ANOMALY_RAD);
};
