import { Depths } from 'src/render/types';
import { gameBus, GameEvents } from './event';

export const drawPathListener = (scene: Phaser.Scene) => {
  gameBus.on(GameEvents.DEBUG_DRAW_PATH, (paths) => {
    for (const path of paths) {
      if (path.length < 2) {
        return;
      }
      const lines: Array<Phaser.GameObjects.Graphics> = [];
      for (let i = 1; i < path.length; i++) {
        const thisUnit = path[i];
        const { x, y } = path[i - 1];
        const line = scene.add.graphics();
        const size = 2;
        line.lineStyle(size, 0xffffff, 0.5);
        line.lineBetween(thisUnit.x, thisUnit.y, x, y);
        line.setDepth(Depths.INTERFACE);
        lines.push(line);
      }
      setTimeout(() => {
        lines.forEach((line) => line.destroy(true));
      }, 2500);
    }
  });
};
