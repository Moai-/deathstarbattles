import { createDeathStar, fireProjectile } from '../entities/deathStar';
import { createRandomAsteroid } from '../entities/asteroid';
import playerCols from './playerCols';
import { getPosition, getRadius, setPosition } from '../util';
import { GameWorld } from 'shared/src/ecs/world';

type TurnInput = {
  playerId: number;
  angle: number;
  power: number;
};

type GameObject = { x: number; y: number; radius: number };

type ClearanceFunction = (a: number, b: number) => number;

const playerClearance: ClearanceFunction = (a, b) => a + b + 80;
const objectClearance: ClearanceFunction = (a, b) => a + b + 30;

export default class GameManager {
  // globals
  private scene: Phaser.Scene;
  private world: GameWorld;

  // UI
  private circle?: Phaser.GameObjects.Arc;
  private line?: Phaser.GameObjects.Line;
  private angleInput = window.document.getElementById(
    'angle',
  ) as HTMLInputElement;
  private powerInput = window.document.getElementById(
    'power',
  ) as HTMLInputElement;
  private endTurnBtn = window.document.getElementById('endtn');
  private currentAngle = 0;
  private currentPower = 20;

  // game management
  private history: Array<Array<TurnInput>> = [];
  private players: Array<number> = [];
  private activePlayer = -1;
  private turnInputs: Array<TurnInput> = [];

  constructor(scene: Phaser.Scene, world: GameWorld) {
    this.scene = scene;
    this.world = world;
    this.endTurnBtn!.onclick = () => this.endTurn();
    this.angleInput.onchange = (evt) =>
      this.collectInput(
        this.currentPower,
        parseInt((evt.target as HTMLInputElement)!.value, 10),
      );
    this.powerInput.onchange = (evt) =>
      this.collectInput(
        parseInt((evt.target as HTMLInputElement)!.value, 10),
        this.currentAngle,
      );
  }

  startGame() {
    this.scene.input.on('pointerdown', this.handlePointerClick, this);

    const player1 = createDeathStar(this.world, 0, 0, playerCols[0]);
    // const player2 = createDeathStar(this.world, 0, 0, playerCols[1]);

    this.players.push(player1);
    // this.players.push(player1, player2);

    const playerPositions = this.generateNonOverlappingPositions(
      this.players.map(getRadius),
      playerClearance,
    );

    playerPositions.map((pt, eid) => setPosition(eid, pt));

    const numAsteroids = 1;
    // const numAsteroids = Phaser.Math.Between(3, 10);

    const asteroids: Array<number> = [];

    for (let i = 0; i < numAsteroids; i++) {
      asteroids.push(createRandomAsteroid(this.world));
    }

    const asteroidPositions = this.generateNonOverlappingPositions(
      asteroids.map(getRadius),
      objectClearance,
      playerPositions,
    );

    asteroids.map((eid, astIdx) => setPosition(eid, asteroidPositions[astIdx]));

    this.startTurn();
  }

  private startTurn() {
    if (this.activePlayer < 0) {
      this.activePlayer = 0;
    }
    if (this.history.length) {
      const lastTurn = this.history[this.history.length - 1];
      const thisPlayerInput = lastTurn.find(
        (inputs) => inputs.playerId === this.activePlayer,
      );
      if (thisPlayerInput) {
        const { angle, power } = thisPlayerInput;
        this.collectInput(power, angle);
      }
    }
    this.createGraphic();
  }

  private endTurn() {
    this.removeGraphic();
    this.turnInputs.push({
      playerId: this.activePlayer,
      angle: this.currentAngle,
      power: this.currentPower,
    });

    if (this.activePlayer + 1 === this.players.length) {
      this.activePlayer = -1;
      this.history.push([...this.turnInputs]);
      this.firePhase();
    } else {
      this.activePlayer = this.activePlayer + 1;
      this.startTurn();
    }
  }

  private firePhase() {
    this.turnInputs.forEach(({ playerId, angle, power }) => {
      fireProjectile(this.world, playerId, angle, power);
    });
    this.turnInputs = [];
  }

  private collectInput(power: number, angle: number) {
    this.currentPower = power;
    this.currentAngle = angle;

    console.log(power, angle);

    this.updateVector(this.currentAngle, this.currentPower);
  }

  private createGraphic(): void {
    const center = getPosition(this.activePlayer);
    const radius = 60;

    this.circle = this.scene.add
      .circle(center.x, center.y, radius, 0xffffff, 0)
      .setStrokeStyle(1, 0xffffff);
    this.line = this.scene.add.line(0, 0, 0, 0, 0, 0, 0xffffff).setOrigin(0, 0);
    this.line.setDepth(1);
  }

  private removeGraphic(): void {
    this.circle?.destroy();
    this.line?.destroy();
  }

  private updateVector(angleDeg: number, power: number): void {
    if (!this.line) {
      return;
    }
    const radius = 60;
    const clampedPower = Phaser.Math.Clamp(power, 20, 100);
    const length = Phaser.Math.Linear(
      radius * 0.25,
      radius,
      (clampedPower - 20) / 80,
    );
    const angleRad = Phaser.Math.DegToRad(angleDeg);

    const dx = Math.cos(angleRad) * length;
    const dy = Math.sin(angleRad) * length;
    const center = getPosition(this.activePlayer);

    this.line.setTo(center.x, center.y, center.x + dx, center.y + dy);
  }

  private handlePointerClick(pointer: Phaser.Input.Pointer): void {
    if (this.activePlayer < 0) {
      return;
    }
    const center = getPosition(this.activePlayer);
    const radius = 60;
    const click = new Phaser.Math.Vector2(pointer.x, pointer.y);
    const dist = Phaser.Math.Distance.BetweenPoints(center, click);

    if (dist <= radius + 10) {
      const direction = click.clone().subtract(center);
      const angleDeg = Phaser.Math.RadToDeg(
        Math.atan2(direction.y, direction.x),
      );
      const power = Phaser.Math.Clamp(
        Phaser.Math.Linear(20, 100, dist / radius),
        20,
        100,
      );

      this.updateVector(angleDeg, power);

      this.angleInput.value = `${angleDeg}`;
      this.powerInput.value = `${power}`;
      this.currentAngle = angleDeg;
      this.currentPower = power;
    }
  }

  private generateNonOverlappingPositions(
    radii: number[],
    minDistFn: ClearanceFunction,
    existing: GameObject[] = [],
  ) {
    const placed: GameObject[] = [];
    const { width, height } = this.scene.scale;

    for (const radius of radii) {
      let attempt = 0;
      let found = false;

      while (attempt++ < 1000 && !found) {
        const x = Phaser.Math.Between(radius, width - radius);
        const y = Phaser.Math.Between(radius, height - radius);

        const candidate = { x, y, radius };

        const tooClose = [...existing, ...placed].some((other) => {
          const dist = Phaser.Math.Distance.Between(x, y, other.x, other.y);
          return dist < minDistFn(radius, other.radius);
        });

        if (!tooClose) {
          placed.push(candidate);
          found = true;
        }
      }

      if (!found) {
        throw new Error(
          `Failed to place object with radius ${radius} after 1000 attempts.`,
        );
      }
    }

    return placed;
  }
}
