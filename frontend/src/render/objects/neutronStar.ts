import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { Renderable } from '../components/renderable';
import generateStarCols from '../elements/starCols';
import drawCorona from '../elements/corona';
import { nailToContainer } from 'src/util';
import { ui32ToCol } from 'shared/src/utils';
import { drawJet, JetStyle } from '../elements/jet';
import { HasPolarJets } from 'shared/src/ecs/components/hasPolarJets';

const renderNeutronStar: RenderObject = (scene, eid) => {

  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const container = scene.add.container(x, y);
  const baseCol = ui32ToCol(Renderable.col[eid]);
  const cols = generateStarCols(baseCol, 12);
  const coronaSteps = 50;
  const coronaLayers = 8;
  const coronaRadius = radius * 1.2;
  const corona = drawCorona(
    scene,
    { x: 0, y: 0 },
    coronaRadius,
    cols[5],
    coronaLayers,
    coronaSteps,
    1.2,
  );
  container.add(scene.add.circle(0, 0, radius, cols[4]));
  container.add(scene.add.circle(0, 0, radius * 0.8, cols[2]));
  container.add(scene.add.circle(0, 0, radius * 0.6, baseCol));
  const jetStyle: JetStyle = {
    length: HasPolarJets.length[eid],
    innerRadius: HasPolarJets.innerRadius[eid],
    spreadRad: HasPolarJets.spreadRad[eid],
    layers: 5,
    coreAlpha: 0.1,
    edgeAlpha: 0.02,
    falloffPow: 1.5,
    depth: Depths.GFX,
  };
  const axisAngleRad = Math.atan2(HasPolarJets.dirY[eid], HasPolarJets.dirX[eid]);
  const jetA = drawJet(scene, { x: 0, y: 0 }, baseCol, axisAngleRad, jetStyle);
  const jetB = drawJet(scene, { x: 0, y: 0 }, baseCol, axisAngleRad + Math.PI, jetStyle);
  container.add(jetA);
  container.add(jetB);
  container.setDepth(Depths.STARS);
  return nailToContainer(container, corona);
};

export default renderNeutronStar;
