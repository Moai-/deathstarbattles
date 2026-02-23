import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { Renderable } from '../components/renderable';
import generateStarCols from '../elements/starCols';
import drawCorona from '../elements/corona';
import { nailToContainer } from 'src/util';
import { ui32ToCol } from 'shared/src/utils';
import { drawAccretionDisk } from '../elements/accretionDisk';

const renderWhiteDwarf: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const container = scene.add.container(x, y);
  const baseCol = ui32ToCol(Renderable.col[eid]);
  const cols = generateStarCols(baseCol, 12);


  const shouldHaveDisk = Phaser.Math.Between(1, 2) === 1;
  const otherLayers = scene.add.container(x, y);
  if (shouldHaveDisk) {
    const disk = drawAccretionDisk(
      scene,
      { x: 0, y: 0 },
      cols[0],
      {
        outerRadius: radius * 4,
        innerRadius: radius * 1.2,
        thickness: 0.5,
        alpha: Phaser.Math.FloatBetween(0.4,  0.8),
        bands: Phaser.Math.Between(3, 8),
        turbulence: Phaser.Math.FloatBetween(0.2, 0.7),
        glowFrac: Phaser.Math.FloatBetween(0.55, 0.75),
        depth: Depths.GFX,
      },
    );
    disk.setRotation(Math.random() * Math.PI * 2);
    otherLayers.add(disk);
  } else {
    const coronaSteps = 50;
    const coronaLayers = 8;
    const coronaRadius = radius * 1.5;
    const corona = drawCorona(
      scene,
      { x: 0, y: 0 },
      coronaRadius,
      cols[5],
      coronaLayers,
      coronaSteps,
      1.2,
    );
    otherLayers.add(corona);
  }
  container.add(scene.add.circle(0, 0, radius, cols[4]));
  container.add(scene.add.circle(0, 0, radius * 0.8, cols[2]));
  container.add(scene.add.circle(0, 0, radius * 0.6, baseCol));
  container.setDepth(Depths.STARS);
  return nailToContainer(container, otherLayers);
};

export default renderWhiteDwarf;
