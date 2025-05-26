export const addEquatorialRidge = (scene, container, radius, options = {
    color: 0x000000,
    thickness: 2,
    scaleY: 0.2, // Vertical flattening
    alpha: 0.4,
    angle: Math.PI / 5.3, // Light direction
}) => {
    const { color, thickness, scaleY, alpha, angle } = options;
    const graphics = scene.add.graphics();
    graphics.lineStyle(thickness, color, alpha);
    // Calculate start and end angles for the visible arc
    const startAngle = angle - Math.PI / 4;
    const endAngle = angle + Math.PI / 2;
    const ellipseX = 0;
    const ellipseY = 0;
    const radiusX = radius;
    const radiusY = radius * scaleY;
    // Draw the elliptical arc directly
    graphics.beginPath();
    const segmentSteps = 100;
    const angleStep = (endAngle - startAngle) / segmentSteps;
    for (let i = 0; i <= segmentSteps; i++) {
        const theta = startAngle + i * angleStep;
        const x = ellipseX + Math.cos(theta) * radiusX;
        const y = ellipseY + Math.sin(theta) * radiusY;
        if (i === 0) {
            graphics.moveTo(x, y);
        }
        else {
            graphics.lineTo(x, y);
        }
    }
    graphics.strokePath();
    container.add(graphics);
};
