import { Depths } from 'src/render/types';
import { gameBus, GameEvents } from './event';
import { BaseScene } from 'src/game/baseScene';

export const drawPathListener = (scene: BaseScene) => {
  gameBus.on(GameEvents.DEBUG_DRAW_PATH, (debugInfo) => {
    if (!scene.debug) {
      return;
    }
    const { colour, paths } = debugInfo;
    for (let pathIdx = 0; pathIdx < paths.length; pathIdx++) {
      const path = paths[pathIdx];
      const alpha = 0.8 - pathIdx * 0.1;
      const size = 3 - pathIdx * 0.5;
      if (path.length < 2) {
        return;
      }
      const lines: Array<Phaser.GameObjects.Graphics> = [];
      for (let i = 1; i < path.length; i++) {
        const thisUnit = path[i];
        const { x, y } = path[i - 1];
        const line = scene.add.graphics();
        line.lineStyle(size, colour, alpha);
        line.lineBetween(thisUnit.x, thisUnit.y, x, y);
        line.setDepth(Depths.INTERFACE);
        lines.push(line);
      }
      setTimeout(() => {
        lines.forEach((line) => line.destroy(true));
      }, 5000);
    }
  });
};
