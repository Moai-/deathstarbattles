import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { HasPolarJets } from 'shared/src/ecs/components/hasPolarJets';
import { drawJet, JetStyle } from '../elements/jet';
import { generateRandomCol } from 'shared/src/utils';
import { drawAccretionDisk } from '../elements/accretionDisk';
import { HasGravity } from 'shared/src/ecs/components';
import generateStarCols from '../elements/starCols';

const renderJetBlackHole: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const container = scene.add.container(x, y);
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
  const baseCol = generateRandomCol(
    { r: 253, g: 40, b: 10 },
    { r: 3, g: 216, b: 51 },
  );
  const cols = generateStarCols(baseCol, 6);
  const jetA = drawJet(scene, { x: 0, y: 0 }, cols[5], axisAngleRad, jetStyle);
  const jetB = drawJet(scene, { x: 0, y: 0 }, cols[5], axisAngleRad + Math.PI, jetStyle);
  const disk = drawAccretionDisk(
    scene,
    { x: 0, y: 0 },
    cols[0],
    {
      outerRadius: (radius * (HasGravity.strength[eid] / 4000)),
      innerRadius: radius * 0.95,
      thickness: 0.32,
      alpha: 1,
      bands: Phaser.Math.Between(5, 10),
      turbulence: Phaser.Math.FloatBetween(0.6, 1.0),
      glowFrac: Phaser.Math.FloatBetween(0.75, 0.99),
      depth: Depths.GFX,
    },
  );
  disk.setRotation(axisAngleRad + Math.PI / 2);

  container.add(jetA);
  container.add(jetB);
  container.add(disk);

  container.setDepth(Depths.STARS);
  return container;
};

export default renderJetBlackHole;
