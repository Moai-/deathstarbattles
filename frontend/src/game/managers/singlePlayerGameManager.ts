import {
  OtherActions,
  PlayerTypes,
} from 'shared/src/types';
import { Collision } from 'shared/src/ecs/components';
import { BaseGameManager } from './baseGameManager';

// This manager allows one player to play the game against bots.
export class SinglePlayerGameManager extends BaseGameManager {

  protected async getPlayerInput() {
    const playerInfo = this.getActivePlayer();
    await super.getPlayerInput();
    if (playerInfo.type !== PlayerTypes.HUMAN) {
      return;
    }
    const currentStation = this.getActiveStation();

    this.inputHandler.toggleAcceptInput(true);
    this.indicator.radius = 30 * (Collision.radius[currentStation] / 8);

    this.indicator.drawIndicator();
    this.renderManager.hideAllchildren();

    const thisPlayerInput = this.getPreviousTurnInput(currentStation);

    if (thisPlayerInput) {
      const { angle, power } = thisPlayerInput;
      this.syncAnglePower(angle, power);

      if (thisPlayerInput.otherAction !== OtherActions.HYPERSPACE) {
        const parent = this.projectileManager.getByPlayerId(currentStation);
        if (parent && !this.isHyperspace) {
          this.renderManager.showChildren(parent.ownId);
        }
      }
    } else {
      this.syncAnglePower();
    }

  }

  protected async endTurn() {
    const playerInfo = this.getActivePlayer();
    const currentStation = this.getActiveStation();
    if (playerInfo.isAlive && playerInfo.type === PlayerTypes.HUMAN && this.stationsActive[currentStation]) {
      this.turnInputs.push({
        stationId: currentStation,
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
    this.renderManager.removeAllChildren();
    super.firePhase();
  }

  private syncAnglePower(angle: number = 0, power: number = 20) {
    this.inputHandler.setAnglePower(angle, power);
    this.indicator.updateVector(angle, power);
  }
}
