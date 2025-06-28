import { BG_TEXTURE } from './constants';

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
    let radius = 0;
    if (rand < 0.99) {
      radius = Phaser.Math.FloatBetween(0.3, 5);
    } else {
      radius = Phaser.Math.FloatBetween(5, 9); // Rare large stars
    }

    const reds = Phaser.Math.Between(0, 33);
    const purples = Phaser.Math.Between(270, 340);
    const hue = Phaser.Math.Between(0, 4) > 2 ? reds : purples;
    const saturation = Phaser.Math.Between(40, 80);
    const lightness = Phaser.Math.Between(10, 20);
    const color = Phaser.Display.Color.HSLToColor(
      hue / 360,
      saturation / 100,
      lightness / 100,
    ).color;

    graphics.fillStyle(color);
    graphics.fillCircle(x, y, radius);
  }

  renderTexture.draw(graphics);
  graphics.destroy();

  renderTexture.saveTexture(BG_TEXTURE);

  const bg = scene.add.image(0, 0, BG_TEXTURE).setOrigin(0, 0);
  bg.setDisplaySize(scene.scale.width, scene.scale.height);
};
