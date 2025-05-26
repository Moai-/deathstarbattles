import { Position } from 'shared/src/ecs/components/position';
import { Collision } from 'shared/src/ecs/components/collision';
import { Renderable } from '../components/renderable';
import { ui32ToCol } from '../../util/col';
import { addShadow } from '../elements/shadow';
const renderJovian = (scene, eid) => {
    const x = Position.x[eid];
    const y = Position.y[eid];
    const radius = Collision.radius[eid];
    const circle = scene.add.circle(0, 0, radius, ui32ToCol(Renderable.col[eid]));
    const container = scene.add.container(x, y);
    container.add(circle);
    addShadow(scene, container, radius);
    return container;
};
export default renderJovian;
