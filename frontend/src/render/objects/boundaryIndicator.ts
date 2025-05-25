import { ui32ToCol } from '../../util';
import { Renderable } from '../components/renderable';

const renderBoundaryIndicator = (scene: Phaser.Scene, parentEid: number) => {
  const graphics = scene.add.triangle(
    0,
    0,
    0,
    10,
    -10,
    -10,
    10,
    -10,
    ui32ToCol(Renderable.col[parentEid]),
    1,
  );
  return graphics;
};

export default renderBoundaryIndicator;
