import { OtherActions } from 'shared/src/types';
import { Renderable } from 'src/render/components/renderable';
import { Depths } from 'src/render/types';
import {
  gameBus,
  GameEvents,
  getPosition,
  getRadius,
  ui32ToCol,
} from 'src/util';

export class FiringIndicator {
  private scene: Phaser.Scene;
  private radius: number;
  private circle?: Phaser.GameObjects.Arc;
  private line?: Phaser.GameObjects.Line;
  private square?: Phaser.GameObjects.Rectangle;
  private getTargetId: () => number;
  private onAnglePowerUpdate: (angle: number, power: number) => void = () => {};
  private isUsingHyperspace = false;
  private isDragging = false;
  private didBind = false;

  constructor(
    scene: Phaser.Scene,
    getTargetId: () => number,
    radius: number = 60,
  ) {
    this.scene = scene;
    this.radius = radius;
    this.getTargetId = getTargetId;
  }

  setAnglePowerListener(cb: (angle: number, power: number) => void) {
    this.onAnglePowerUpdate = cb;
  }

  toggleHyperspace(toggle: boolean) {
    this.isUsingHyperspace = toggle;
    if (this.isUsingHyperspace) {
      this.circle?.setVisible(false);
      this.line?.setVisible(false);
      this.drawHyperspaceSquare();
    } else {
      this.circle?.setVisible(true);
      this.line?.setVisible(true);
      this.clearHyperspaceSquare();
    }
  }

  drawHyperspaceSquare() {
    const eid = this.getTargetId();
    const { x, y } = getPosition(eid);
    const radius = getRadius(eid);
    const col = ui32ToCol(Renderable.col[eid]);
    const s = radius * 2 * 1.5;
    this.square = this.scene.add
      .rectangle(x, y, s, s, 0, 0)
      .setDepth(Depths.INTERFACE)
      .setStrokeStyle(1, col);
  }

  clearHyperspaceSquare() {
    this.square?.destroy();
    this.square = undefined;
  }

  create() {
    const { x, y } = getPosition(this.getTargetId());
    this.circle = this.scene.add
      .circle(x, y, this.radius, 0xffffff, 0)
      .setStrokeStyle(1, 0xffffff)
      .setDepth(Depths.INTERFACE);
    this.line = this.scene.add.line(0, 0, 0, 0, 0, 0, 0xffffff).setOrigin(0, 0);
    this.line.setDepth(Depths.INTERFACE);

    if (!this.didBind) {
      this.scene.input.on('pointerdown', this.handlePointerDown, this);
      this.scene.input.on('pointermove', this.handlePointerMove, this);
      this.scene.input.on('pointerup', this.handlePointerUp, this);
      this.scene.input.on('pointerupoutside', this.handlePointerUp, this);
      this.didBind = true;
      gameBus.on(GameEvents.ANGLE_POWER_UI, ({ angle, power }) => {
        this.updateVector(angle, power);
      });
      gameBus.on(GameEvents.OTHER_ACTION_UI, (action) => {
        if (action === OtherActions.HYPERSPACE) {
          this.toggleHyperspace(true);
        } else if (!action) {
          this.toggleHyperspace(false);
        }
      });
    }
  }

  remove() {
    this.circle?.destroy();
    this.line?.destroy();
    this.circle = undefined;
    this.line = undefined;
    this.clearHyperspaceSquare();
  }

  updateVector(angleDeg: number, power: number) {
    if (!this.line) return;
    this.onAnglePowerUpdate(angleDeg, power);
    const clampedPower = Phaser.Math.Clamp(power, 20, 100);
    const length = Phaser.Math.Linear(
      this.radius * 0.25,
      this.radius,
      (clampedPower - 20) / 80,
    );
    const angleRad = Phaser.Math.DegToRad(angleDeg);
    const { x, y } = getPosition(this.getTargetId());

    const dx = Math.cos(angleRad) * length;
    const dy = Math.sin(angleRad) * length;

    this.line.setTo(x, y, x + dx, y + dy);
  }

  private handlePointerDown(p: Phaser.Input.Pointer) {
    this.isDragging = true;
    this.updateAnglePower(p);
  }

  private handlePointerMove(p: Phaser.Input.Pointer) {
    if (this.isDragging) {
      this.updateAnglePower(p);
    }
  }

  private handlePointerUp() {
    this.isDragging = false;
  }

  private updateAnglePower(pointer: Phaser.Input.Pointer) {
    if (this.isUsingHyperspace) {
      console.log('using hyperspace so quit early');
      return;
    }
    const loc = new Phaser.Math.Vector2(pointer.x, pointer.y);
    const { x, y } = getPosition(this.getTargetId());
    const dist = Phaser.Math.Distance.Between(x, y, loc.x, loc.y);
    if (dist <= this.radius + 10) {
      const dir = loc.clone().subtract({ x, y });
      const angle = Phaser.Math.RadToDeg(Math.atan2(dir.y, dir.x));
      const power = Phaser.Math.Clamp(
        Phaser.Math.Linear(20, 100, dist / this.radius),
        20,
        100,
      );
      this.updateVector(angle, power);
    }
  }
}
