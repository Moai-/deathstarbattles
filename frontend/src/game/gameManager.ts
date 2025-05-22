import { GameWorld } from 'shared/src/ecs/world';
import { GameObjectManager } from '../render/objectManager';
import { FiringIndicator } from './firingIndicator';
import { PlayerInputHandler } from './playerInput';
import {
  generateNonOverlappingPositions,
  objectClearance,
  runGameSetup,
} from './gameSetup';
import playerCols from './playerCols';
import { ProjectileManager } from './projectileManager';
import { getRadius, setPosition } from '../util';
import { CollisionHandler } from './collisionHandler';
import { GameObject, TurnInput, OtherActions } from './types';

export default class GameManager {
  // globals
  private scene: Phaser.Scene;
  private world: GameWorld;
  private objectManager: GameObjectManager;

  // game components
  private indicator: FiringIndicator;
  private inputHandler: PlayerInputHandler;
  private collisionHandler: CollisionHandler;
  private projectileManager: ProjectileManager;

  // game state
  private activePlayer = -1;
  private players: Array<number> = [];
  private allObjects: Array<GameObject> = [];
  private history: Array<Array<TurnInput>> = [];
  private turnInputs: Array<TurnInput> = [];
  private willHyperspace: Array<number> = [];

  constructor(
    scene: Phaser.Scene,
    world: GameWorld,
    objectManager: GameObjectManager,
  ) {
    this.scene = scene;
    this.world = world;
    this.objectManager = objectManager;
    this.indicator = new FiringIndicator(scene, () => this.activePlayer);
    this.projectileManager = new ProjectileManager(world);
    this.projectileManager.setCleanupCallback(() => this.postCombatPhase());
    this.collisionHandler = new CollisionHandler(world);
    this.collisionHandler.setProjectileDestroyedCallback((eid) =>
      this.projectileManager.removeProjectile(eid),
    );
    this.collisionHandler.setTargetDestroyedCallback((eid) => {
      this.players = this.players.filter((pid) => pid !== eid);
    });
    this.inputHandler = new PlayerInputHandler(
      'angle',
      'power',
      'endtn',
      'hyper',
      (angle, power) => this.indicator.updateVector(angle, power),
      () => this.endTurn(),
      () => {},
    );
  }

  create() {
    this.scene.input.on('pointerdown', (p: Phaser.Input.Pointer) =>
      this.indicator.handlePointerClick(p, (angle, power) => {
        this.inputHandler.setAnglePower(angle, power);
      }),
    );
  }

  onCollision(eid1: number, eid2: number) {
    this.collisionHandler.handleCollision(eid1, eid2);
  }

  onCleanup(eid: number) {
    this.projectileManager.removeProjectile(eid);
  }

  startGame() {
    const { playerIds, objectPlacements } = runGameSetup(
      this.scene,
      this.world,
      {
        playerCount: 2,
        playerColors: playerCols,
        minAsteroids: 3,
        maxAsteroids: 10,
      },
    );

    this.players = playerIds;
    this.allObjects = objectPlacements;
    this.startTurn();
  }

  private firePhase() {
    this.objectManager.removeAllChildren();
    this.projectileManager.reset();
    this.turnInputs.forEach(({ playerId, angle, power, otherAction }) => {
      if (!otherAction) {
        this.projectileManager.fireFrom(playerId, angle, power);
      }
      if (otherAction === OtherActions.HYPERSPACE) {
        this.willHyperspace.push(playerId);
      }
    });
  }

  private postCombatPhase() {
    this.turnInputs = [];
    setTimeout(() => {
      if (this.willHyperspace.length) {
        this.willHyperspace.forEach((playerId) => this.useHyperspace(playerId));
        setTimeout(() => {
          this.willHyperspace = [];
          this.startTurn();
        }, 200);
      } else {
        this.startTurn();
      }
    }, 1000);
  }

  private startTurn() {
    if (this.activePlayer < 0) {
      this.activePlayer = 0;
    }
    this.indicator.create();
    this.objectManager.hideAllchildren();

    if (this.players.length < 2) {
      console.log('player %s wins', this.players[0]);
      return;
    }
    if (this.history.length) {
      const lastTurn = this.history[this.history.length - 1];
      const thisPlayerInput = lastTurn.find(
        (inputs) => inputs.playerId === this.activePlayer,
      );
      if (thisPlayerInput) {
        const { angle, power } = thisPlayerInput;
        this.syncAnglePower(angle, power);
        if (thisPlayerInput.otherAction !== OtherActions.HYPERSPACE) {
          const parent = this.projectileManager.getByPlayerId(
            this.activePlayer,
          );
          if (parent) {
            this.objectManager.showChildren(parent.ownId);
          }
        }
      } else {
        this.syncAnglePower();
      }
    }
  }

  private endTurn() {
    this.indicator.remove();
    this.turnInputs.push({
      playerId: this.activePlayer,
      angle: this.inputHandler.getCurrentAngle(),
      power: this.inputHandler.getCurrentPower(),
      otherAction: this.inputHandler.getCurrentOtherAction(),
    });
    this.inputHandler.resetHyperspace();

    if (this.activePlayer + 1 === this.players.length) {
      this.activePlayer = -1;
      this.firePhase();
    } else {
      this.activePlayer = this.activePlayer + 1;
      this.startTurn();
    }
  }

  private useHyperspace(eid: number) {
    const { width, height } = this.scene.scale;
    const myRadius = getRadius(eid);
    const [newPosition] = generateNonOverlappingPositions(
      width,
      height,
      [myRadius],
      objectClearance,
      this.allObjects,
    );
    const { x, y } = newPosition;
    setPosition(eid, x, y);
    this.allObjects[eid].x = x;
    this.allObjects[eid].y = y;
  }

  private syncAnglePower(angle: number = 0, power: number = 20) {
    this.inputHandler.setAnglePower(angle, power);
    this.indicator.updateVector(angle, power);
  }
}
