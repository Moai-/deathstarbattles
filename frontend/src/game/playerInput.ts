import { OtherActions } from 'shared/src/types';
import { gameBus, GameEvents } from 'src/util';

export class PlayerInputHandler {
  private angle: number = 0;
  private power: number = 20;
  private hyperspaceActive: boolean = false;
  private currentOtherAction: OtherActions | null = null;

  private onEndTurn: () => void;

  constructor(onEndTurn: () => void) {
    this.onEndTurn = onEndTurn;

    this.initListeners();
    this.setAnglePower(0, 20);
  }

  private initListeners() {
    gameBus.on(GameEvents.ANGLE_POWER_UI, ({ angle, power }) => {
      this.angle = angle;
      this.power = power;
    });
    gameBus.on(GameEvents.END_TURN, () => this.onEndTurn());
    gameBus.on(
      GameEvents.OTHER_ACTION,
      (otherAction) => (this.currentOtherAction = otherAction),
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
}
