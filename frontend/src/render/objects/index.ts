import renderDeathStar from './deathStar';

import { RenderableTypes, RenderObject } from '../types';
import renderDeathBeam from './deathBeam';

const renderMap: Record<RenderableTypes, RenderObject> = {
  [RenderableTypes.NONE]: () =>
    new Phaser.GameObjects.GameObject(new Phaser.Scene(), 'sprite'),
  [RenderableTypes.DEATHSTAR]: renderDeathStar,
  [RenderableTypes.DEATHBEAM]: renderDeathBeam,
};

export default renderMap;
