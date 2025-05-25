import renderDeathStar from './deathStar';

import { RenderableTypes, RenderObject } from '../types';
import renderDeathBeam from './deathBeam';
import renderAsteroid from './asteroid';
import renderBoundaryIndicator from './boundaryIndicator';
import renderBlackHole from './blackHole';

const renderMap: Record<RenderableTypes, RenderObject> = {
  [RenderableTypes.NONE]: () =>
    new Phaser.GameObjects.GameObject(new Phaser.Scene(), 'sprite'),
  [RenderableTypes.BOUNDARY_INDICATOR]: renderBoundaryIndicator,
  [RenderableTypes.DEATHSTAR]: renderDeathStar,
  [RenderableTypes.DEATHBEAM]: renderDeathBeam,
  [RenderableTypes.ASTEROID]: renderAsteroid,
  [RenderableTypes.BLACK_HOLE]: renderBlackHole,
};

export default renderMap;
