import { BaseScene } from 'src/game/baseScene';

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
  scene: BaseScene,
  eid: number,
) => Phaser.GameObjects.Container;
