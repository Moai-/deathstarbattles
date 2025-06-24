import { ui32ToCol } from 'shared/src/utils';
import { Renderable } from '../components/renderable';
import { Depths } from '../types';

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
  graphics.setDepth(Depths.INTERFACE);
  return graphics;
};

export default renderBoundaryIndicator;
