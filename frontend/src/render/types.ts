import { Scene } from 'phaser';

export enum RenderableTypes {
  NONE,
  BOUNDARY_INDICATOR,
  DEATHSTAR,
  DEATHBEAM,
  ASTEROID,
  BLACK_HOLE,
  PLANET,
  STAR,
  JOVIAN,
}

export type RenderObject = (
  scene: Scene,
  eid: number,
) => Phaser.GameObjects.Container;
