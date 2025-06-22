import { AnyPoint } from 'shared/src/types';
import { makeId } from 'src/game/util';
import { Depths } from '../types';
import generateStarCols, { darkenCol } from './starCols';

const drawCorona = (
  scene: Phaser.Scene,
  loc: AnyPoint,
  baseRadius: number,
  baseColor: number,
  layers = 3,
  steps = 300,
  radiusOverride = 1,
) => {
  const colors = generateStarCols(baseColor, layers);
  const { x, y } = loc;

  const maxRadius =
    radiusOverride * baseRadius * (1.05 + 0.07 * (layers - 1)) +
    baseRadius * 0.05;
  const size = maxRadius * 2;
  const renderTexture = scene.make
    .renderTexture({
      width: size,
      height: size,
    })
    .setVisible(false);

  const graphics = scene.add.graphics();

  let alpha = 1;

  for (let layer = layers - 1; layer >= 0; layer--) {
    const color = darkenCol(colors[layer], 0.5);
    const radius = radiusOverride * baseRadius * (1.05 + 0.07 * layer);
    const spikeAmplitude = radius * 0.05;

    const offsets = [];
    for (let i = 0; i <= steps; i++) {
      offsets[i] = (Math.random() - 0.5) * spikeAmplitude * 2;
    }

    graphics.fillStyle(color, 1);
    graphics.beginPath();

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      const r = radius + offsets[i];
      const px = maxRadius + Math.cos(theta) * r; // Use maxRadius to center
      const py = maxRadius + Math.sin(theta) * r;

      if (i === 0) {
        graphics.moveTo(px, py);
      } else {
        graphics.lineTo(px, py);
      }
    }

    graphics.closePath();
    graphics.fillPath();
    graphics.setAlpha(alpha);
    alpha = alpha - 0.1;
  }

  renderTexture.draw(graphics);
  graphics.destroy(true);

  const texId = makeId();
  renderTexture.saveTexture(texId);

  // Add image at (x, y) with origin at center (so it aligns with loc)
  const img = scene.add
    .image(x, y, texId)
    .setOrigin(0.5, 0.5)
    .setDepth(Depths.BOTTOM);
  return img;
};

export default drawCorona;
