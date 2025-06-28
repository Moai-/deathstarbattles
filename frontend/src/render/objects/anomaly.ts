import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { Renderable } from '../components/renderable';
import generateStarCols from '../elements/starCols';
import drawCorona from '../elements/corona';
import { nailToContainer } from 'src/util';
import { getHyperLocus, getPosition, ui32ToCol } from 'shared/src/utils';
import { createShard } from '../elements/shard';
import { rotateToward } from 'src/util/position';

const renderAnomaly: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const container = scene.add.container(x, y);
  const variant = Renderable.variant[eid];
  const baseCol = ui32ToCol(Renderable.col[eid]);

  if (!variant) {
    const cols = generateStarCols(baseCol, 3);
    const coronaSteps = 50;
    const coronaLayers = 8;
    const corona = drawCorona(
      scene,
      { x: 0, y: 0 },
      radius,
      cols[2],
      coronaLayers,
      coronaSteps,
    );
    container.add(scene.add.circle(0, 0, radius, cols[1]));
    container.add(scene.add.circle(0, 0, radius * 0.8, cols[0]));
    container.add(scene.add.circle(0, 0, radius * 0.6, baseCol));
    container.setDepth(Depths.STARS);
    return nailToContainer(container, corona);
  } else {
    // I am a bad programmer for doing this
    // I should not be accessing the world when it isn't explicitly passed in
    // I should be in programmer jail for this piece of code
    const shard = createShard(scene, {
      alpha: 1,
      baseHue: Phaser.Math.Between(1, 255),
      light: 0.3,
    });
    const locus = getHyperLocus(scene.world);
    container.add(shard);
    if (locus) {
      const pos = getPosition(locus);
      rotateToward(container, pos.x, pos.y);
    }
    container.setDepth(Depths.STARS);
    return container;
  }
};

export default renderAnomaly;
