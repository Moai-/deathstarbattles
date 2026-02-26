import { BG_TEXTURE } from './constants';
import { drawDustLanes } from './elements/dustLane';
import { drawGalaxy } from './elements/galaxy';
import { drawStar } from './elements/star';

export const generateDeepSpace = (
  scene: Phaser.Scene,
) => {
  const width = scene.scale.width;
  const height = scene.scale.height;

  const renderTexture = scene.make
    .renderTexture({
      width: width,
      height: height,
    })
    .setVisible(false);

  // 0. Figure out center where galaxy will be
  const tenthWidth = width / 10;
  const offsetX = Phaser.Math.Between(1, tenthWidth);
  const noisyX = width / 2 + (Phaser.Math.Between(1, 2) === 1 ? offsetX : -offsetX);

  const tenthHeight = height / 10;
  const offsetY = Phaser.Math.Between(1, tenthHeight);
  const noisyY = height / 2 + (Phaser.Math.Between(1, 2) === 1 ? offsetY : -offsetY);


  // 1. Old background stars
  const oldStars = scene.add.graphics();

  for (let i = 0; i < 500; i++) {
    const x = Phaser.Math.Between(0, width);
    const y = Phaser.Math.Between(0, height);
    drawStar(oldStars, {x, y, bri: Phaser.Math.Between(3, 6), hue: 'reds'})
  }
  renderTexture.draw(oldStars);
  oldStars.destroy();

  // 2. Foreground galaxy
  const themeHue = Phaser.Math.Between(200, 320);
  const galaxy = scene.add.graphics();
  drawGalaxy(galaxy, {
    x: noisyX,
    y: noisyY,
    outerRadius: tenthWidth * 7,
    tilt: Phaser.Math.FloatBetween(0.6, 0.8),
    hue: themeHue,
    armCount: Phaser.Math.Between(2, 8),
    armStrength: Phaser.Math.FloatBetween(0.6, 0.96),
    armTwist: Phaser.Math.FloatBetween(8, 12),
    armJitter: Phaser.Math.FloatBetween(0.5, 0.9),
  });

  renderTexture.draw(galaxy);
  galaxy.destroy();

  // 3. Some foreground stars clustered around the galactic center
  const foregroundStars = scene.add.graphics();
  const startX = noisyX - tenthWidth * 3;
  const endX = noisyX + tenthWidth * 3;
  const startY = noisyY - tenthHeight * 3;
  const endY = noisyY + tenthHeight * 3;

  for (let i = 0; i < 500; i++) {
    const x = Phaser.Math.Between(startX, endX);
    const y = Phaser.Math.Between(startY, endY);
    const rand = Math.random();
    drawStar(foregroundStars, {x, y, bri: Phaser.Math.Between(5, 10), big: rand < 0.99, hue: Phaser.Math.Between(themeHue - 10, themeHue + 10)})
  }
  renderTexture.draw(foregroundStars);
  foregroundStars.destroy();

  // 4. Dust lanes
  // const dustG = scene.add.graphics();

  // drawDustLanes(dustG, {
  //   x: noisyX,
  //   y: noisyY,
  //   length: 1600,
  //   thickness: Phaser.Math.FloatBetween(80, 170),
  //   curvature: Phaser.Math.FloatBetween(-0.6, 0.6),
  //   alpha: Phaser.Math.FloatBetween(0.7, 0.99),
  //   warmth: 0.35,
  //   contrast: 0.85,
  //   glowEdge: true,
  //   laneCount: Phaser.Math.Between(1, 3),
  // });

  // renderTexture.draw(dustG);
  // dustG.destroy();

  // drawNebula(galaxy, {
  //   x: 500,
  //   y: 200,
  //   radius: Phaser.Math.FloatBetween(280, 600),
  //   hue: Phaser.Math.Between(190, 330),
  //   vividness: 0.85,
  //   alpha: 1,
  //   tilt: Math.random() * 0.6,
  //   aspect: Phaser.Math.FloatBetween(0.8, 1.4),
  //   glowEdges: true,
  // })



  renderTexture.saveTexture(BG_TEXTURE);

  const bg = scene.add.image(0, 0, BG_TEXTURE).setOrigin(0, 0);
  bg.setDisplaySize(scene.scale.width, scene.scale.height);
};
