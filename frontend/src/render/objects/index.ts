import renderDeathStar from './deathStar';

import { RenderableTypes, RenderObject } from '../types';
import renderDeathBeam from './deathBeam';
import renderAsteroid from './asteroid';
import renderBoundaryIndicator from './boundaryIndicator';

const renderMap: Record<RenderableTypes, RenderObject> = {
  [RenderableTypes.NONE]: () =>
    new Phaser.GameObjects.GameObject(new Phaser.Scene(), 'sprite'),
  [RenderableTypes.BOUNDARY_INDICATOR]: renderBoundaryIndicator,
  [RenderableTypes.DEATHSTAR]: renderDeathStar,
  [RenderableTypes.DEATHBEAM]: renderDeathBeam,
  [RenderableTypes.ASTEROID]: renderAsteroid,
};

export default renderMap;
