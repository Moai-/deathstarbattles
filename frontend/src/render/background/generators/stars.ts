import { BackgroundGenerator } from "src/render/types";
import { drawStar } from "../elements";
import { generateBlank } from "./blank";

export const generateStars: BackgroundGenerator = (scene) => {
  const world = scene.world;

  const starCount = world.random.between(1800, 2300);

  const renderTexture = generateBlank(scene);
  const {width, height} = renderTexture;

  const graphics = scene.add.graphics();

  for (let i = 0; i < starCount; i++) {
    const x = world.random.between(0, width);
    const y = world.random.between(0, height);
    const isBig = world.random.oneIn(99);
    drawStar(world, graphics, {
      x, 
      y, 
      size: isBig ? Phaser.Math.FloatBetween(0.3, 5) : Phaser.Math.FloatBetween(5, 9)})
  }

  renderTexture.draw(graphics);
  graphics.destroy();

  return renderTexture;
}