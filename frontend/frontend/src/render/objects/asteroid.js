import { Position } from 'shared/src/ecs/components/position';
import { Collision } from 'shared/src/ecs/components/collision';
import { addShadow } from '../elements/shadow';
const renderAsteroid = (scene, eid) => {
    const x = Position.x[eid];
    const y = Position.y[eid];
    const radius = Collision.radius[eid];
    const circle = scene.add.circle(0, 0, radius, 0x774e00);
    const container = scene.add.container(x, y);
    container.add(circle);
    addShadow(scene, container, radius);
    return container;
};
export default renderAsteroid;
