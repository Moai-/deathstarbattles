import { BackgroundGenerator } from "src/render/types";
import { generateBlank } from "./blank";
import { drawDustLanes, drawGalaxyComposite, drawNebula, drawStar } from "../elements";

export const generateNebular: BackgroundGenerator = (scene) => {
  const renderTexture = generateBlank(scene);
  const {width, height} = renderTexture;
  const world = scene.world;

  // 1. Background stars
  const oldStars = scene.add.graphics();

  for (let i = 0; i < 500; i++) {
    const x = world.random.between(0, width);
    const y = world.random.between(0, height);
    drawStar(
      world, 
      oldStars, 
      {
        x, 
        y, 
        size: world.random.oneIn(99) 
          ? world.random.betweenFloat(0.3, 5) 
          : world.random.betweenFloat(5, 9)
      }
    )
  }
  renderTexture.draw(oldStars);
  oldStars.destroy();

  // 2. Maybe a background galaxy?
  const shouldHaveGalaxy = world.random.oneIn(7);
  if (shouldHaveGalaxy) {
    const galaxyCount = world.random.between(1, 3);
    for (let i = 0; i < galaxyCount; i++) {
      const tex = drawGalaxyComposite(scene, {
        outerRadius: world.random.between(280, 600),
        armCount: world.random.between(2, 8),
        armStrength: world.random.betweenFloat(0.5, 0.8),
        armTwist: world.random.betweenFloat(4, 12),
        armJitter: world.random.betweenFloat(0.3, 0.6),
      });
    
      renderTexture.draw(tex, world.random.between(0, width), world.random.between(0, height));
      tex.destroy();
    }
  }

  // 3. Nebula
  const themeHue = Phaser.Math.Between(190, 330);
  const nebula = scene.add.graphics();
  const rotation = world.random.rnd();
  drawNebula(world, nebula, {
    x: width / 2,
    y: height / 2,
    radius: world.random.between(800, 1500),
    hue: themeHue,
    rotation,
    vividness: 0.85,
    alpha: 0.95,
    tilt: world.random.rnd() * 0.6,
    aspect: world.random.betweenFloat(0.8, 1.4),
    glowEdges: true,
  });
  renderTexture.draw(nebula);
  nebula.destroy();

  // 4. Maybe dust lane?
  const shouldHaveDust = world.random.oneIn(3);
  if (shouldHaveDust) {
    const dustG = scene.add.graphics();
    drawDustLanes(world, dustG, {
      x: width / 2,
      y: height / 2,
      length: 1600,
      rotation,
      thickness: world.random.between(80, 170),
      curvature: world.random.betweenFloat(-0.6, 0.6),
      alpha: world.random.betweenFloat(0.7, 0.99),
      warmth: 0.35,
      contrast: 0.85,
      glowEdge: true,
      laneCount: world.random.between(1, 3),
    });

    renderTexture.draw(dustG);
    dustG.destroy();
  }

  // 5. Some foreground stars
  const foregroundStars = scene.add.graphics();

  for (let i = 0; i < 500; i++) {
    const x = world.random.between(0, width);
    const y = world.random.between(0, height);
    drawStar(world, foregroundStars, 
      {
        x, 
        y, 
        size: world.random.oneIn(99) 
          ? world.random.betweenFloat(0.3, 5) 
          : world.random.betweenFloat(5, 9), 
        hue: world.random.jitter(themeHue, 10)})
  }
  renderTexture.draw(foregroundStars);
  foregroundStars.destroy();

  return renderTexture;
}