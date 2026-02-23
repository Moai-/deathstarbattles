import renderDeathStar from './deathStar';
import { ObjectTypes } from 'shared/src/types';
import { RenderObject } from '../types';

import renderDeathBeam from './deathBeam';
import renderAsteroid from './asteroid';
import renderBlackHole from './blackHole';
import renderPlanet from './planet';
import renderStar from './star';
import renderJovian from './jovian';
import renderSupergiant from './supergiant';
import renderWhiteDwarf from './whiteDwarf';
import renderWormhole from './wormhole';
import renderBigWormhole from './bigWormhole';
import renderWhiteHole from './whiteHole';
import renderAnomaly from './anomaly';
import renderLocus from './locus';
import renderNeutronStar from './neutronStar';
import renderJetBlackHole from './jetBlackHole';

const renderMap: Record<ObjectTypes, RenderObject> = {
  [ObjectTypes.NONE]: renderBlackHole,
  [ObjectTypes.DEATHSTAR]: renderDeathStar,
  [ObjectTypes.DEATHBEAM]: renderDeathBeam,
  [ObjectTypes.ASTEROID]: renderAsteroid,
  [ObjectTypes.BLACK_HOLE]: renderBlackHole,
  [ObjectTypes.PLANET]: renderPlanet,
  [ObjectTypes.STAR]: renderStar,
  [ObjectTypes.RED_GIANT]: renderStar,
  [ObjectTypes.SUPERGIANT]: renderSupergiant,
  [ObjectTypes.JOVIAN]: renderJovian,
  [ObjectTypes.WHITE_DWARF]: renderWhiteDwarf,
  [ObjectTypes.WORMHOLE]: renderWormhole,
  [ObjectTypes.BIG_WORMHOLE]: renderBigWormhole,
  [ObjectTypes.WHITE_HOLE]: renderWhiteHole,
  [ObjectTypes.ANOMALY]: renderAnomaly,
  [ObjectTypes.LOCUS]: renderLocus,
  [ObjectTypes.TUNNEL_LOCUS]: renderWhiteHole,
  [ObjectTypes.NEUTRON_STAR]: renderNeutronStar,
  [ObjectTypes.JET_BLACK_HOLE]: renderJetBlackHole,
};

export default renderMap;
