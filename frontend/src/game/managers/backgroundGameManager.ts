import { BaseGameManager } from './baseGameManager';

// Simple manager to loop a background game.
export class BackgroundGameManager extends BaseGameManager {

  protected checkEndgameCondition(): boolean {
    const didWin = super.checkEndgameCondition();
    if (didWin) {
      queueMicrotask(() => {
        // Restart the whole scene after winning
        this.scene.destroy();
        this.scene.create();
      });
    }
    return didWin;
  }
}
