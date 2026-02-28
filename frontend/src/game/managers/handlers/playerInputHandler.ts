import { OtherActions } from 'shared/src/types';
import { gameBus, GameEvents } from 'src/util';

export class PlayerInputHandler {
  private angle: number = 0;
  private power: number = 20;
  private currentOtherAction: OtherActions | null = null;
  private acceptInput = true;

  private onEndTurn: () => void = () => {};

  create() {
    this.initListeners();
    this.setAnglePower(0, 20);
  }

  setOnEndTurnCallback(onEndTurn: () => void) {
    this.onEndTurn = onEndTurn;
  }

  private initListeners() {
    gameBus.on(GameEvents.ANGLE_POWER_UI, ({ angle, power }) => {
      if (this.acceptInput) {
        this.angle = angle;
        this.power = power;
      }
    });
    gameBus.on(GameEvents.END_TURN, () => this.acceptInput && this.onEndTurn());
    gameBus.on(
      GameEvents.OTHER_ACTION_UI,
      (otherAction) =>
        this.acceptInput && (this.currentOtherAction = otherAction),
    );
  }

  public setAnglePower(angle: number, power: number) {
    if (this.angle !== angle) {
      this.angle = angle;
    }
    if (this.power !== power) {
      this.power = power;
    }
    gameBus.emit(GameEvents.ANGLE_POWER_GAME, {
      angle: this.angle,
      power: this.power,
    });
  }

  public resetHyperspace() {
    this.currentOtherAction = null;
    gameBus.emit(GameEvents.OTHER_ACTION_GAME, OtherActions.NONE);
    gameBus.emit(GameEvents.OTHER_ACTION_UI, OtherActions.NONE);
  }

  public getCurrentAngle() {
    return this.angle;
  }

  public getCurrentPower() {
    return this.power;
  }

  public getCurrentOtherAction() {
    return this.currentOtherAction;
  }

  public toggleAcceptInput(accept: boolean) {
    this.acceptInput = accept;
  }

  destroy() {
    gameBus.off(GameEvents.END_TURN);
    gameBus.off(GameEvents.OTHER_ACTION_UI);
    gameBus.off(GameEvents.ANGLE_POWER_UI);
    this.angle = 0;
    this.power = 20;
    this.currentOtherAction = null;
  }
}
