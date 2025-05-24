import { OtherActions } from 'shared/src/types';

const HYPER_ON = 'Hyperspace [ENGAGED]';
const HYPER_OFF = 'Hyperspace [OFFLINE]';

export class PlayerInputHandler {
  private angleInput: HTMLInputElement;
  private powerInput: HTMLInputElement;
  private endTurnBtn: HTMLElement;
  private hyperBtn: HTMLElement;

  private angle: number = 0;
  private power: number = 20;
  private hyperspaceActive: boolean = false;
  private currentOtherAction: OtherActions | null = null;

  private onAnglePowerChange: (angle: number, power: number) => void;
  private onEndTurn: () => void;
  private onToggleHyperspace: (active: boolean) => void;

  constructor(
    angleInputId: string,
    powerInputId: string,
    endTurnBtnId: string,
    hyperBtnId: string,
    onAnglePowerChange: (angle: number, power: number) => void,
    onEndTurn: () => void,
    onToggleHyperspace: (active: boolean) => void,
  ) {
    this.angleInput = document.getElementById(angleInputId) as HTMLInputElement;
    this.powerInput = document.getElementById(powerInputId) as HTMLInputElement;
    this.endTurnBtn = document.getElementById(endTurnBtnId)!;
    this.hyperBtn = document.getElementById(hyperBtnId)!;

    this.onAnglePowerChange = onAnglePowerChange;
    this.onEndTurn = onEndTurn;
    this.onToggleHyperspace = onToggleHyperspace;

    this.initListeners();
    this.setAnglePower(0, 20);
  }

  private initListeners() {
    this.angleInput.onchange = (e) => {
      this.angle = parseInt((e.target as HTMLInputElement).value, 10);
      this.emitAnglePower();
    };
    this.powerInput.onchange = (e) => {
      this.power = parseInt((e.target as HTMLInputElement).value, 10);
      this.emitAnglePower();
    };
    this.endTurnBtn.onclick = () => this.onEndTurn();
    this.hyperBtn.onclick = () => this.toggleHyperspace();
  }

  private emitAnglePower() {
    this.onAnglePowerChange(this.angle, this.power);
  }

  private toggleHyperspace() {
    this.hyperspaceActive = !this.hyperspaceActive;
    this.hyperBtn.innerHTML = this.hyperspaceActive ? HYPER_ON : HYPER_OFF;
    this.currentOtherAction = this.hyperspaceActive
      ? OtherActions.HYPERSPACE
      : null;
    this.onToggleHyperspace(this.hyperspaceActive);
  }

  public setAnglePower(angle: number, power: number) {
    this.angle = angle;
    this.power = power;
    this.angleInput.value = `${angle}`;
    this.powerInput.value = `${power}`;
    this.emitAnglePower();
  }

  public resetHyperspace() {
    this.hyperspaceActive = false;
    this.hyperBtn.innerHTML = HYPER_OFF;
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
