import { BG_TEXTURE } from './constants';
import { drawGalaxyComposite } from './elements/galaxy';
import { drawStar } from './elements/star';
import { applyMask } from './helpers';

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

  // const rotation = (Math.random() * Math.PI * 2);
  const rotation = Math.random() * 0.1;
  const outerRadius = tenthWidth * 7;
  const tilt = 0.9;

  // 1. Old background stars
  const farawayStars = scene.add.graphics();
  for (let i = 0; i < 500; i++) {
    const x = Phaser.Math.Between(0, width);
    const y = Phaser.Math.Between(0, height);
    drawStar(farawayStars, {x, y, bri: Phaser.Math.Between(10, 20), sat: 30, hue: 'reds', size: Phaser.Math.FloatBetween(0.3, 2)})
  }
  renderTexture.draw(farawayStars);
  farawayStars.destroy();

  const oldStars = scene.add.graphics();

  for (let i = 0; i < 500; i++) {
    const x = Phaser.Math.Between(0, width);
    const y = Phaser.Math.Between(0, height);
    drawStar(oldStars, {x, y, bri: Phaser.Math.Between(3, 6), hue: 'reds'})
  }
  renderTexture.draw(oldStars);
  oldStars.destroy();

  // 2. Foreground galaxy
  const themeHue = Phaser.Math.Between(200, 300);
  const tex = drawGalaxyComposite(scene, {
    outerRadius,
    tilt,
    rotation,
    hue: themeHue,
    lightness: 110,
    // saturation: 50,
    armCount: Phaser.Math.Between(2, 8),
    armStrength: Phaser.Math.FloatBetween(0.5, 1),
    armTwist: Phaser.Math.FloatBetween(6, 14),
    armJitter: Phaser.Math.FloatBetween(0.5, 0.9),
    gasAlpha: Phaser.Math.FloatBetween(0.3, 0.8),
    coreRadius: Phaser.Math.Between(tenthWidth / 4, tenthWidth * 2),
    coreFuzz: Phaser.Math.FloatBetween(0.1, 0.9),
    coreAlpha: Phaser.Math.FloatBetween(0.2, 0.7),
    zStrength: Phaser.Math.FloatBetween(0.5, 0.9),
  });

  renderTexture.draw(tex, noisyX, noisyY);
  tex.destroy();


  // 3. Some foreground stars clustered around the galactic center
  const foregroundStars = scene.add.graphics();
  const foregroundTex = scene.make
    .renderTexture({width, height})
    .setVisible(false)
    .clear();
    
  const startX = noisyX - tenthWidth * 4;
  const endX = noisyX + tenthWidth * 4;
  const startY = noisyY - tenthHeight * 4;
  const endY = noisyY + tenthHeight * 4;

  for (let i = 0; i < 500; i++) {
    const x = Phaser.Math.Between(startX, endX);
    const y = Phaser.Math.Between(startY, endY);
    const rand = Math.random();
    drawStar(foregroundStars, {
      x, 
      y, 
      bri: Phaser.Math.Between(5, 10), 
      size: rand < 0.99 
        ? Phaser.Math.FloatBetween(0.3, 5) 
        : Phaser.Math.FloatBetween(5, 9), 
      hue: Phaser.Math.Between(themeHue - 10, themeHue + 10)})
  }
  foregroundTex.draw(foregroundStars);
  foregroundStars.destroy();

  const {targetImg, cleanUp} = applyMask(foregroundTex, scene, {
    x: noisyX,
    y: noisyY,
    outerRadius: outerRadius * 1.5,
    tilt: tilt * 1.5,
    rotation
  })

  renderTexture.draw(targetImg);

  cleanUp();

  // 4. Bright, active stars in the galaxy foreground
  const activeStars = scene.add.graphics();
  const lim = Phaser.Math.Between(5, 10);
  for (let i = 0; i < lim; i++) {
    const x = Phaser.Math.Between(noisyX - tenthWidth * 2, noisyX + tenthWidth * 2);
    const y = Phaser.Math.Between(noisyY - tenthHeight * 2, noisyY + tenthHeight * 2);
    drawStar(activeStars, {x, y, bri: Phaser.Math.Between(30, 65), sat: Phaser.Math.Between(20, 80), hue: themeHue, size: Phaser.Math.FloatBetween(0.5, 3)})
  }
  // activeStars.setRotation(tilt);
  renderTexture.draw(activeStars);
  activeStars.destroy();


  renderTexture.saveTexture(BG_TEXTURE);

  const bg = scene.add.image(0, 0, BG_TEXTURE).setOrigin(0, 0);
  bg.setDisplaySize(scene.scale.width, scene.scale.height);
};
