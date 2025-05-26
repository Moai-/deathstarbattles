import { OtherActions } from 'shared/src/types';
const HYPER_ON = 'Hyperspace [ENGAGED]';
const HYPER_OFF = 'Hyperspace [OFFLINE]';
export class PlayerInputHandler {
    constructor(angleInputId, powerInputId, endTurnBtnId, hyperBtnId, onAnglePowerChange, onEndTurn, onToggleHyperspace) {
        this.angle = 0;
        this.power = 20;
        this.hyperspaceActive = false;
        this.currentOtherAction = null;
        this.angleInput = document.getElementById(angleInputId);
        this.powerInput = document.getElementById(powerInputId);
        this.endTurnBtn = document.getElementById(endTurnBtnId);
        this.hyperBtn = document.getElementById(hyperBtnId);
        this.onAnglePowerChange = onAnglePowerChange;
        this.onEndTurn = onEndTurn;
        this.onToggleHyperspace = onToggleHyperspace;
        this.initListeners();
        this.setAnglePower(0, 20);
    }
    initListeners() {
        this.angleInput.oninput = (e) => {
            this.angle = parseInt(e.target.value, 10);
            this.emitAnglePower();
        };
        this.powerInput.oninput = (e) => {
            this.power = parseInt(e.target.value, 10);
            this.emitAnglePower();
        };
        this.endTurnBtn.onclick = () => this.onEndTurn();
        this.hyperBtn.onclick = () => this.toggleHyperspace();
    }
    emitAnglePower() {
        this.onAnglePowerChange(this.angle, this.power);
    }
    toggleHyperspace() {
        this.hyperspaceActive = !this.hyperspaceActive;
        this.hyperBtn.innerHTML = this.hyperspaceActive ? HYPER_ON : HYPER_OFF;
        this.currentOtherAction = this.hyperspaceActive
            ? OtherActions.HYPERSPACE
            : null;
        this.onToggleHyperspace(this.hyperspaceActive);
    }
    setAnglePower(angle, power) {
        this.angle = angle;
        this.power = power;
        this.angleInput.value = `${angle}`;
        this.powerInput.value = `${power}`;
        this.emitAnglePower();
    }
    resetHyperspace() {
        this.hyperspaceActive = false;
        this.hyperBtn.innerHTML = HYPER_OFF;
        this.currentOtherAction = null;
    }
    getCurrentAngle() {
        return this.angle;
    }
    getCurrentPower() {
        return this.power;
    }
    getCurrentOtherAction() {
        return this.currentOtherAction;
    }
}
