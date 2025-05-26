import { Position } from 'shared/src/ecs/components/position';
import { HasGravity } from 'shared/src/ecs/components/hasGravity';
const drawGravityVisualizer = (scene, eid) => {
    const x = Position.x[eid];
    const y = Position.y[eid];
    const radius = HasGravity.radius[eid];
    const strength = HasGravity.strength[eid];
    const { width, height } = scene.scale;
    const frag = scene.cache.text.get('gravityShaderFragment');
    console.log('render with strength %s radius %s xy %s:%s', strength, radius, x, y);
    const base = new Phaser.Display.BaseShader('gravityShader', frag, undefined, {
        centerX: { type: '1f', value: x },
        centerY: { type: '1f', value: height - y },
        radius: { type: '1f', value: radius },
        strength: { type: '1f', value: strength * 2 },
        resolution: { type: '2f', value: [width, height] },
        hardness: { type: '1f', value: 1.0 },
    });
    const gravityShader = scene.add
        .shader(base, 0, 0, scene.scale.width, scene.scale.height)
        .setOrigin(0, 0);
    // gravityShader.setUniform('center.value', [0.0, 0.0]); // local center in the quad
    // gravityShader.setUniform('radius.value', 90.0);
    console.log(gravityShader.uniforms);
};
export default drawGravityVisualizer;
