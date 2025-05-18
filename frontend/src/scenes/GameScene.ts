import Phaser from 'phaser';
import { addEntity } from 'bitecs';
import { createGameWorld } from 'shared/src/ecs/world';
import { createMovementSystem } from 'shared/src/ecs/systems/movement';

export class GameScene extends Phaser.Scene {
  private world = createGameWorld();
  private movementSystem = createMovementSystem();
  private playerEid = -1;
  private circle1!: Phaser.GameObjects.Arc;
  private circle2!: Phaser.GameObjects.Arc;
  private drawnLine?: Phaser.GameObjects.Graphics;
  private lineStart!: Phaser.Math.Vector2;
  private lineEnd!: Phaser.Math.Vector2;
  private currentLinePos!: Phaser.Math.Vector2;
  private drawingSpeed = 200; // pixels per second

  constructor() {
    super('game');
  }

  create() {
    this.playerEid = addEntity(this.world);
    const { width, height } = this.scale;

    // Generate two non-overlapping circle positions
    let pos1: Phaser.Math.Vector2, pos2: Phaser.Math.Vector2;
    const minDistance = 100;

    do {
      pos1 = new Phaser.Math.Vector2(
        Phaser.Math.Between(100, width - 100),
        Phaser.Math.Between(100, height - 100),
      );
      pos2 = new Phaser.Math.Vector2(
        Phaser.Math.Between(100, width - 100),
        Phaser.Math.Between(100, height - 100),
      );
    } while (pos1.distance(pos2) < minDistance);

    // Draw the two circles
    this.circle1 = this.add.circle(pos1.x, pos1.y, 30, 0xff0000);
    this.circle2 = this.add.circle(pos2.x, pos2.y, 30, 0x00ff00);

    // Listen for pointer clicks
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.startDrawingLine(pointer.worldX, pointer.worldY);
    });
  }

  private startDrawingLine(targetX: number, targetY: number) {
    // Erase old line
    this.drawnLine?.destroy();

    // Start new line animation
    this.lineStart = new Phaser.Math.Vector2(this.circle1.x, this.circle1.y);
    this.lineEnd = new Phaser.Math.Vector2(targetX, targetY);
    this.currentLinePos = this.lineStart.clone();

    this.drawnLine = this.add.graphics();
    this.drawnLine.lineStyle(2, 0xffffff, 1);
  }

  update(time: number, delta: number) {
    if (!this.drawnLine || !this.lineStart || !this.lineEnd) return;

    const direction = this.lineEnd
      .clone()
      .subtract(this.currentLinePos)
      .normalize();
    const distanceToDraw = (this.drawingSpeed * delta) / 1000;

    const remainingDistance = this.currentLinePos.distance(this.lineEnd);
    const drawDistance = Math.min(distanceToDraw, remainingDistance);

    if (drawDistance > 0) {
      const nextPoint = this.currentLinePos
        .clone()
        .add(direction.scale(drawDistance));
      this.drawnLine.beginPath();
      this.drawnLine.moveTo(this.currentLinePos.x, this.currentLinePos.y);
      this.drawnLine.lineTo(nextPoint.x, nextPoint.y);
      this.drawnLine.strokePath();
      this.currentLinePos.copy(nextPoint);
    }
  }
}
