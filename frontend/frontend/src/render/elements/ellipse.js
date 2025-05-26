export const addEllipse = (scene, container, options) => {
    const { offset, radiusX, radiusY = radiusX, // Default to circle if radiusY not provided
    color = 0x000000, alpha = 0.4, } = options;
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, alpha);
    // Draw ellipse at specified offset
    graphics.fillEllipse(offset.x, offset.y, radiusX * 2, radiusY * 2);
    container.add(graphics);
};
