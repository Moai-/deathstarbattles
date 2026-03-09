import { BackgroundGenerator } from "src/render/types";

export const generateBlank: BackgroundGenerator = (scene) => {
  const width = scene.scale.width;
  const height = scene.scale.height;

  const renderTexture = scene.make
    .renderTexture({
      width: width,
      height: height,
    })
    .setVisible(false);

  return renderTexture;
}