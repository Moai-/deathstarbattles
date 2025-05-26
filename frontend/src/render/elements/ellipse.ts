export const addEllipse = (
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  options: {
    offset: { x: number; y: number }; // Offset from center
    radiusX: number; // Horizontal radius
    radiusY?: number; // Optional vertical radius (if omitted, use radiusX)
    color?: number; // Fill color (default: black)
    alpha?: number; // Fill alpha (default: 0.4)
  },
) => {
  const {
    offset,
    radiusX,
    radiusY = radiusX, // Default to circle if radiusY not provided
    color = 0x000000,
    alpha = 0.4,
  } = options;

  const graphics = scene.add.graphics();
  graphics.fillStyle(color, alpha);

  // Draw ellipse at specified offset
  graphics.fillEllipse(offset.x, offset.y, radiusX * 2, radiusY * 2);

  container.add(graphics);
};
