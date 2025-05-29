import { Scene } from 'phaser';

export enum RenderableTypes {
  NONE,
  DEATHSTAR,
  DEATHBEAM,
  ASTEROID,
  BLACK_HOLE,
  PLANET,
  STAR,
  JOVIAN,
}

export enum Depths {
  BOTTOM,
  PLANETS,
  STARS,
  PROJECTILES,
  STATIONS,
  INTERFACE,
}

export type RenderObject = (
  scene: Scene,
  eid: number,
) => Phaser.GameObjects.Container;
