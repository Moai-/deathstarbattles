import { rotateToward } from 'src/util/position';
import { createShard } from '../elements/shard';
import { BG_TEXTURE } from './constants';

export const generateBackgroundShards = (
  scene: Phaser.Scene,
  shardCount = 200,
  center: { x?: number; y?: number } = {},
) => {
  const width = scene.scale.width;
  const height = scene.scale.height;
  const cx = center.x ?? Phaser.Math.Between(0, width);
  const cy = center.y ?? Phaser.Math.Between(0, height);

  const rt = scene.make.renderTexture({ width, height }).setVisible(false);


  for (let i = 0; i < shardCount; i++) {
    const g = scene.add.graphics();
    const x = Phaser.Math.Between(0, width);
    const y = Phaser.Math.Between(0, height);
    createShard(g);
    g.setPosition(x, y);
    rotateToward(g, cx, cy);
    rt.draw(g);
    g.destroy();
  }



  rt.saveTexture(BG_TEXTURE);

  const bg = scene.add.image(0, 0, BG_TEXTURE).setOrigin(0, 0);
  bg.setDisplaySize(width, height);
};
