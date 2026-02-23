import { BG_TEXTURE } from './constants';
import { drawNebula } from './elements/nebula';
import { drawStar } from './elements/star';

export const generateBackgroundStars = (
  scene: Phaser.Scene,
  starCount: number = 2000,
) => {
  const width = scene.scale.width;
  const height = scene.scale.height;

  const renderTexture = scene.make
    .renderTexture({
      width: width,
      height: height,
    })
    .setVisible(false);

  const graphics = scene.add.graphics();

  for (let i = 0; i < starCount; i++) {
    const x = Phaser.Math.Between(0, width);
    const y = Phaser.Math.Between(0, height);
    const rand = Math.random();
    drawStar(graphics, {x, y, big: rand < 0.99})
  }

  const galaxy = scene.add.graphics();

  drawNebula(galaxy, {
    x: 500,
    y: 200,
    radius: Phaser.Math.FloatBetween(280, 600),
    hue: Phaser.Math.Between(190, 330),
    vividness: 0.85,
    alpha: 1,
    tilt: Math.random() * 0.6,
    aspect: Phaser.Math.FloatBetween(0.8, 1.4),
    glowEdges: true,
  })

  renderTexture.draw(graphics);
  renderTexture.draw(galaxy);
  graphics.destroy();
  galaxy.destroy();

  renderTexture.saveTexture(BG_TEXTURE);

  const bg = scene.add.image(0, 0, BG_TEXTURE).setOrigin(0, 0);
  bg.setDisplaySize(scene.scale.width, scene.scale.height);
};
