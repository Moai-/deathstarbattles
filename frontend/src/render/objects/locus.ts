import { RenderObject } from '../types';

const renderLocus: RenderObject = (scene) => {
  const container = scene.add.container(-30, -30);
  return container;
};

export default renderLocus;
