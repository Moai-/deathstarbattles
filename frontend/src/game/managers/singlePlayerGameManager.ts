import {
  OtherActions,
  PlayerTypes,
} from 'shared/src/types';
import { Collision } from 'shared/src/ecs/components';
import { BaseGameManager } from './baseGameManager';

// This manager allows one player to play the game against bots.
export class SinglePlayerGameManager extends BaseGameManager {

  protected getPlayerInput() {
    const playerInfo = this.getActivePlayer();
    if (playerInfo) {
      if (playerInfo.type !== PlayerTypes.HUMAN) {
        this.endTurn();
        return;
      }
    }
    this.inputHandler.toggleAcceptInput(true);
    this.indicator.radius = 30 * (Collision.radius[playerInfo.id] / 8);

    this.indicator.drawIndicator();
    this.syncAnglePower();
    this.objectManager.hideAllchildren();

    const thisPlayerInput = this.getPreviousTurnInput(playerInfo.id);

    if (thisPlayerInput) {
      const { angle, power } = thisPlayerInput;
      this.syncAnglePower(angle, power);
      if (thisPlayerInput.otherAction !== OtherActions.HYPERSPACE) {
        const parent = this.projectileManager.getByPlayerId(playerInfo.id);
        if (parent && !this.isHyperspace) {
          this.objectManager.showChildren(parent.ownId);
        }
      }
    }
  }

  protected async endTurn() {
    const playerInfo = this.getActivePlayer();
    if (playerInfo.isAlive && playerInfo.type === PlayerTypes.HUMAN) {
      this.turnInputs.push({
        playerId: playerInfo.id,
        angle: this.inputHandler.getCurrentAngle(),
        power: this.inputHandler.getCurrentPower(),
        otherAction: this.inputHandler.getCurrentOtherAction(),
      });
      this.inputHandler.resetHyperspace();
    }
    this.inputHandler.toggleAcceptInput(false);
    this.indicator.removeIndicator();
    super.endTurn();
  }

  protected firePhase() {
    this.indicator.removeIndicator();
    this.objectManager.removeAllChildren();
    super.firePhase();
  }

  private syncAnglePower(angle: number = 0, power: number = 20) {
    this.inputHandler.setAnglePower(angle, power);
    this.indicator.updateVector(angle, power);
  }
}
