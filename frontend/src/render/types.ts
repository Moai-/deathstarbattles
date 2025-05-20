import { Scene } from 'phaser';

export enum RenderableTypes {
  NONE,
  DEATHSTAR,
  DEATHBEAM,
  ASTEROID,
}

export type RenderObject = (
  scene: Scene,
  eid: number,
) => Phaser.GameObjects.GameObject;
