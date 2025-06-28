import { GameScene } from 'src/game/gameScene';

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
  scene: GameScene,
  eid: number,
) => Phaser.GameObjects.Container;
