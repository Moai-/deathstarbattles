import generateStarCols, { darkenCol } from './starCols';
const drawCorona = (scene, loc, baseRadius, baseColor, layers = 3) => {
    const graphics = scene.add.graphics();
    const colors = generateStarCols(baseColor, layers);
    const { x, y } = loc;
    for (let layer = layers - 1; layer >= 0; layer--) {
        const color = darkenCol(colors[layer], 0.5);
        const radius = baseRadius * (1.05 + 0.07 * layer);
        const spikeAmplitude = radius * 0.05; // Smaller amplitude for subtle cliffs
        const steps = 300;
        // Precompute random offsets for each point to create jaggedness
        const offsets = [];
        for (let i = 0; i <= steps; i++) {
            offsets[i] = (Math.random() - 0.5) * spikeAmplitude * 2; // Random offsets
        }
        graphics.fillStyle(color, 1);
        graphics.beginPath();
        for (let i = 0; i <= steps; i++) {
            const theta = (i / steps) * Math.PI * 2;
            const r = radius + offsets[i];
            const px = x + Math.cos(theta) * r;
            const py = y + Math.sin(theta) * r;
            if (i === 0) {
                graphics.moveTo(px, py);
            }
            else {
                graphics.lineTo(px, py);
            }
        }
        graphics.closePath();
        graphics.fillPath();
    }
    graphics.setDepth(0);
    return graphics;
};
export default drawCorona;
// Example usage:
// drawCorona(scene, 400, 300, 120, 0xfeff54, 3);
