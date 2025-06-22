import renderDeathStar from './deathStar';

import { RenderableTypes, RenderObject } from '../types';
import renderDeathBeam from './deathBeam';
import renderAsteroid from './asteroid';
import renderBlackHole from './blackHole';
import renderPlanet from './planet';
import renderStar from './star';
import renderJovian from './jovian';
import renderSupergiant from './supergiant';
import renderWhiteDwarf from './whiteDwarf';
import renderWormhole from './wormhole';

const renderMap: Record<RenderableTypes, RenderObject> = {
  [RenderableTypes.NONE]: renderBlackHole,
  [RenderableTypes.DEATHSTAR]: renderDeathStar,
  [RenderableTypes.DEATHBEAM]: renderDeathBeam,
  [RenderableTypes.ASTEROID]: renderAsteroid,
  [RenderableTypes.BLACK_HOLE]: renderBlackHole,
  [RenderableTypes.PLANET]: renderPlanet,
  [RenderableTypes.STAR]: renderStar,
  [RenderableTypes.SUPERGIANT]: renderSupergiant,
  [RenderableTypes.JOVIAN]: renderJovian,
  [RenderableTypes.WHITE_DWARF]: renderWhiteDwarf,
  [RenderableTypes.WORMHOLE]: renderWormhole,
};

export default renderMap;
