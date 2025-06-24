import { Scene } from 'phaser';

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
