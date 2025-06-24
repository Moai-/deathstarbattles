import { AnyPoint } from 'shared/src/types';
import { Depths } from '../types';
import generateStarCols, { darkenCol } from './starCols';
import { makeId } from 'shared/src/utils';

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

export const drawCoronaSpiky = (
  scene: Phaser.Scene,
  loc: AnyPoint,
  baseRadius: number,
  baseColor: number,
  layers = 3,
  spikes = 400, // number of radial lines
  spikiness = 0.5, // 0 to 1, how variable each line is
) => {
  const colors = generateStarCols(baseColor, layers);
  const { x, y } = loc;

  const maxSpikeLength = baseRadius * (1.1 + spikiness); // generous padding
  const maxRadius = maxSpikeLength * (1 + 0.1 * (layers - 1));
  const size = Math.ceil(maxRadius * 2);

  const renderTexture = scene.make
    .renderTexture({
      width: size,
      height: size,
    })
    .setVisible(false);

  const graphics = scene.add.graphics();
  graphics.setDepth(Depths.GFX);

  for (let layer = layers - 1; layer >= 0; layer--) {
    const color = darkenCol(colors[layer], 0.5);
    const innerRadius = baseRadius * (0.9 + 0.05 * layer);
    const outerRadius = baseRadius * (1.1 + 0.1 * layer);
    const alpha = 1 - layer * 0.2;

    graphics.lineStyle(1, color, alpha);

    for (let i = 0; i < spikes; i++) {
      const angle = (i / spikes) * Math.PI * 2;
      const randomFactor = 1 + Math.random() * spikiness;
      const length = Phaser.Math.Linear(innerRadius, outerRadius, randomFactor);
      const dx = Math.cos(angle) * length;
      const dy = Math.sin(angle) * length;

      graphics.beginPath();
      graphics.moveTo(maxRadius, maxRadius);
      graphics.lineTo(maxRadius + dx, maxRadius + dy);
      graphics.strokePath();
    }
  }

  renderTexture.draw(graphics);
  graphics.destroy(true);

  const texId = makeId();
  renderTexture.saveTexture(texId);

  return scene.add
    .image(x, y, texId)
    .setOrigin(0.5, 0.5)
    .setDepth(Depths.BOTTOM);
};

export default drawCorona;
