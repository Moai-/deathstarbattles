import { IWorld } from 'bitecs';

export type DSBScene = Phaser.Scene & {
  world: IWorld;
};
