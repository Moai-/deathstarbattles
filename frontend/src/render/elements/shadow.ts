export const addShadow = (
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  radius: number,
  options = {
    color: 0x000000,
    alpha: 0.4,
    angle: Math.PI * 2,
    offsetFactor: 0.53,
    cutoutScale: 1,
  },
) => {
  const { color, alpha, angle, offsetFactor, cutoutScale } = options;

  const graphics = scene.add.graphics();
  graphics.fillStyle(color, alpha);

  const cutoutRadius = radius * cutoutScale;
  const offset = radius * offsetFactor;
  const cutoutX = Math.cos(angle) * offset;
  const cutoutY = Math.sin(angle) * offset;

  const startAngle = angle + Math.PI / 2;
  const endAngle = angle - Math.PI / 2;

  graphics.beginPath();

  graphics.arc(0, 0, radius, startAngle, endAngle, false);
  graphics.translateCanvas(-cutoutX * 0.3, 0);
  graphics.setScale(0.88, 1);
  graphics.arc(cutoutX, cutoutY, cutoutRadius, endAngle, startAngle, true);

  graphics.closePath();
  graphics.fillPath();

  container.add(graphics);
};
