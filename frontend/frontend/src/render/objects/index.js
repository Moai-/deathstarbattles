import renderDeathStar from './deathStar';
import { RenderableTypes } from '../types';
import renderDeathBeam from './deathBeam';
import renderAsteroid from './asteroid';
import renderBlackHole from './blackHole';
import renderPlanet from './planet';
import renderStar from './star';
import renderJovian from './jovian';
const renderMap = {
    [RenderableTypes.NONE]: renderBlackHole,
    [RenderableTypes.DEATHSTAR]: renderDeathStar,
    [RenderableTypes.DEATHBEAM]: renderDeathBeam,
    [RenderableTypes.ASTEROID]: renderAsteroid,
    [RenderableTypes.BLACK_HOLE]: renderBlackHole,
    [RenderableTypes.PLANET]: renderPlanet,
    [RenderableTypes.STAR]: renderStar,
    [RenderableTypes.JOVIAN]: renderJovian,
};
export default renderMap;
