import { BG_TEXTURE } from './constants';
import { drawDustLanes } from './elements/dustLane';
import { drawGalaxy } from './elements/galaxy';
import { drawNebula } from './elements/nebula';
import { drawStar } from './elements/star';

export const generateNebular = (
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

  // 1. Background stars
  const oldStars = scene.add.graphics();

  for (let i = 0; i < 500; i++) {
    const x = Phaser.Math.Between(0, width);
    const y = Phaser.Math.Between(0, height);
    const rand = Math.random();
    drawStar(oldStars, {x, y, size: rand < 0.99 ? Phaser.Math.FloatBetween(0.3, 5) : Phaser.Math.FloatBetween(5, 9)})
  }
  renderTexture.draw(oldStars);
  oldStars.destroy();

  // 2. Maybe a couple galaxies?
  const shouldHaveGalaxy = Phaser.Math.Between(0, 7) === 5;
  if (shouldHaveGalaxy) {
    const galaxyCount = Phaser.Math.Between(1, 3);
    const galaxies = scene.add.graphics();
    for (let i = 0; i < galaxyCount; i++) {
      drawGalaxy(galaxies, {
        x: Phaser.Math.Between(0, width),
        y: Phaser.Math.Between(0, height),
        outerRadius: Phaser.Math.Between(280, 600),
        armCount: Phaser.Math.Between(2, 8),
        armStrength: 0.75,
        armTwist: Phaser.Math.Between(4, 12),
        armJitter: 0.35,
      });
    }
    renderTexture.draw(galaxies);
    galaxies.destroy();
  }

  // 3. Nebula
  const themeHue = Phaser.Math.Between(190, 330);
  const nebula = scene.add.graphics();
  const rotation = Math.random();
  drawNebula(nebula, {
    x: width / 2,
    y: height / 2,
    radius: Phaser.Math.FloatBetween(800, 1500),
    hue: themeHue,
    rotation,
    vividness: 0.85,
    alpha: 0.95,
    tilt: Math.random() * 0.6,
    aspect: Phaser.Math.FloatBetween(0.8, 1.4),
    glowEdges: true,
  });
  renderTexture.draw(nebula);
  nebula.destroy();

  // 4. Maybe dust lane?
  const shouldHaveDust = Phaser.Math.Between(0, 3) === 2;
  if (shouldHaveDust) {
    const dustG = scene.add.graphics();
    drawDustLanes(dustG, {
      x: width / 2,
      y: height / 2,
      length: 1600,
      rotation,
      thickness: Phaser.Math.FloatBetween(80, 170),
      curvature: Phaser.Math.FloatBetween(-0.6, 0.6),
      alpha: Phaser.Math.FloatBetween(0.7, 0.99),
      warmth: 0.35,
      contrast: 0.85,
      glowEdge: true,
      laneCount: Phaser.Math.Between(1, 3),
    });

    renderTexture.draw(dustG);
    dustG.destroy();
  }


  // 5. Some foreground stars
  const foregroundStars = scene.add.graphics();

  for (let i = 0; i < 500; i++) {
    const x = Phaser.Math.Between(0, width);
    const y = Phaser.Math.Between(0, height);
    const rand = Math.random();
    drawStar(foregroundStars, {x, y, size: rand < 0.99 ? Phaser.Math.FloatBetween(0.3, 5) : Phaser.Math.FloatBetween(5, 9), hue: Phaser.Math.Between(themeHue - 10, themeHue + 10)})
  }
  renderTexture.draw(foregroundStars);
  foregroundStars.destroy();

  renderTexture.saveTexture(BG_TEXTURE);

  const bg = scene.add.image(0, 0, BG_TEXTURE).setOrigin(0, 0);
  bg.setDisplaySize(scene.scale.width, scene.scale.height);
};
