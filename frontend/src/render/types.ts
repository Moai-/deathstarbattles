import { Scene } from 'phaser';

export enum RenderableTypes {
  NONE,
  DEATHSTAR,
  DEATHBEAM,
  ASTEROID,
  BLACK_HOLE,
  PLANET,
  STAR,
  SUPERGIANT,
  WHITE_DWARF,
  JOVIAN,
  WORMHOLE,
  BIG_WORMHOLE,
}

export enum Depths {
  BOTTOM,
  STARS,
  PLANETS,
  PROJECTILES,
  STATIONS,
  GFX,
  INTERFACE,
}

export type RenderObject = (
  scene: Scene,
  eid: number,
) => Phaser.GameObjects.Container;
