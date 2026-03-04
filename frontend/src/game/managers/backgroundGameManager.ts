import { BaseGameManager } from './baseGameManager';

// Simple manager to loop a background game.
export class BackgroundGameManager extends BaseGameManager {

  protected checkEndgameCondition(): boolean {
    const didWin = super.checkEndgameCondition();
    if (didWin) {
      queueMicrotask(() => {
        this.scene.destroy();
        this.scene.create();
      });
    }
    return didWin;
  }
}
