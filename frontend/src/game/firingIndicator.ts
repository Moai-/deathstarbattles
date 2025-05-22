import { getPosition } from '../util';

export class FiringIndicator {
  private scene: Phaser.Scene;
  private radius: number;
  private circle?: Phaser.GameObjects.Arc;
  private line?: Phaser.GameObjects.Line;
  private getTargetId: () => number;

  constructor(
    scene: Phaser.Scene,
    getTargetId: () => number,
    radius: number = 60,
  ) {
    this.scene = scene;
    this.radius = radius;
    this.getTargetId = getTargetId;
  }

  create(): void {
    const { x, y } = getPosition(this.getTargetId());
    this.circle = this.scene.add
      .circle(x, y, this.radius, 0xffffff, 0)
      .setStrokeStyle(1, 0xffffff);
    this.line = this.scene.add.line(0, 0, 0, 0, 0, 0, 0xffffff).setOrigin(0, 0);
    this.line.setDepth(1);
  }

  remove(): void {
    this.circle?.destroy();
    this.line?.destroy();
    this.circle = undefined;
    this.line = undefined;
  }

  updateVector(angleDeg: number, power: number): void {
    if (!this.line) return;

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

  handlePointerClick(
    pointer: Phaser.Input.Pointer,
    onInput: (angle: number, power: number) => void,
  ): void {
    const { x, y } = getPosition(this.getTargetId());
    const click = new Phaser.Math.Vector2(pointer.x, pointer.y);
    const dist = Phaser.Math.Distance.Between(x, y, click.x, click.y);

    if (dist <= this.radius + 10) {
      const dir = click.clone().subtract({ x, y });
      const angle = Phaser.Math.RadToDeg(Math.atan2(dir.y, dir.x));
      const power = Phaser.Math.Clamp(
        Phaser.Math.Linear(20, 100, dist / this.radius),
        20,
        100,
      );
      onInput(angle, power);
    }
  }
}
