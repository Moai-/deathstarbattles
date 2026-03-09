import { BackgroundGenerator } from "src/render/types";
import { generateBlank } from "./blank";
import { drawGalaxyComposite, drawStar } from "../elements";
import { applyMask } from "../helpers";

export const generateDeepSpace: BackgroundGenerator = (scene) => {
  const renderTexture = generateBlank(scene);
  const {width, height} = renderTexture;
  const world = scene.world;

  // 1. Find galaxy center
  const tenthWidth = width / 10;
  const offsetX = world.random.between(1, tenthWidth);
  const noisyX = width / 2 + (world.random.between(1, 2) === 1 ? offsetX : -offsetX);

  const tenthHeight = height / 10;
  const offsetY = world.random.between(1, tenthHeight);
  const noisyY = height / 2 + (world.random.between(1, 2) === 1 ? offsetY : -offsetY);

  // 2. Pre-generate important aspects
  const rotation = Math.random() * 0.1;
  const outerRadius = tenthWidth * 7;
  const tilt = Math.random() > 0.5 ? world.random.betweenFloat(0.1, 0.3) : world.random.betweenFloat(0.7, 1);
  const isDark = Math.random() > 0.5;
  const themeHue = isDark ? world.random.between(200, 300): world.random.between(33, 66);
  const lightness = isDark ? world.random.between(110, 140): world.random.between(80, 110);
  const saturation = isDark ? world.random.between(40, 80): world.random.between(120, 150);

  // 3. Make some background stars
  // Faraway stars -- brighter and more colourful
  const farawayStars = scene.add.graphics();
  for (let i = 0; i < 500; i++) {
    const x = world.random.between(0, width);
    const y = world.random.between(0, height);
    drawStar(world, farawayStars, {x, y, bri: world.random.between(10, 20), sat: 30, hue: 'reds', size: world.random.betweenFloat(0.3, 2)})
  }
  renderTexture.draw(farawayStars);
  farawayStars.destroy();

  // Old stars -- dim and desaturated
  const oldStars = scene.add.graphics();
  for (let i = 0; i < 500; i++) {
    const x = world.random.between(0, width);
    const y = world.random.between(0, height);
    drawStar(world, oldStars, {x, y, bri: world.random.between(3, 6), hue: 'reds'})
  }
  renderTexture.draw(oldStars);
  oldStars.destroy();

  // 4. Foreground galaxy
  const tex = drawGalaxyComposite(scene, {
    outerRadius,
    tilt,
    rotation,
    hue: themeHue,
    lightness,
    saturation,
    armCount: world.random.between(2, 8),
    armStrength: world.random.betweenFloat(0.5, 1),
    armTwist: world.random.betweenFloat(6, 14),
    armJitter: world.random.betweenFloat(0.5, 0.9),
    gasAlpha: world.random.betweenFloat(0.3, 0.8),
    coreRadius: world.random.between(tenthWidth / 4, tenthWidth * 2),
    coreFuzz: world.random.betweenFloat(0.1, 0.9),
    coreAlpha: world.random.betweenFloat(0.2, 0.7),
    zStrength: world.random.betweenFloat(0.5, 0.9),
  });

  renderTexture.draw(tex, noisyX, noisyY);
  tex.destroy();

  // 5. Foreground stars, same colour as the galaxy, overlaid on it but nowhere else
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
    const x = world.random.between(startX, endX);
    const y = world.random.between(startY, endY);
    const rand = Math.random();
    drawStar(world, foregroundStars, {
      x, 
      y, 
      bri: world.random.between(5, 10), 
      size: rand < 0.99 
        ? world.random.betweenFloat(0.3, 5) 
        : world.random.betweenFloat(5, 9), 
      hue: world.random.between(themeHue - 10, themeHue + 10)})
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

  // 6. Bright, twinkling foreground stars in the galaxy -- just a couple
  const activeStars = scene.add.graphics();
  const lim = world.random.between(5, 10);
  for (let i = 0; i < lim; i++) {
    const x = world.random.between(noisyX - tenthWidth * 2, noisyX + tenthWidth * 2);
    const y = world.random.between(noisyY - tenthHeight * 2, noisyY + tenthHeight * 2);
    drawStar(world, activeStars, {x, y, bri: world.random.between(30, 65), sat: world.random.between(20, 80), hue: themeHue, size: world.random.betweenFloat(0.5, 3)})
  }
  // activeStars.setRotation(tilt);
  renderTexture.draw(activeStars);
  activeStars.destroy();

  return renderTexture;
}