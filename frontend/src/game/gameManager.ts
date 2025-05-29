import { GameWorld } from 'shared/src/ecs/world';
import generateTurn from 'shared/src/ai/generateTurn';
import { GameObjectManager } from '../render/objectManager';
import { FiringIndicator } from './firingIndicator';
import { PlayerInputHandler } from './playerInput';
import { objectClearance, runGameSetup } from './gameSetup';
import playerCols from './playerCols';
import { ProjectileManager } from './projectileManager';
import {
  gameBus,
  GameEvents,
  getPosition,
  getRadius,
  setPosition,
} from '../util';
import { CollisionHandler } from './collisionHandler';
import {
  GameObject,
  TurnInput,
  OtherActions,
  PlayerInfo,
  GameState,
  PlayerTypes,
} from 'shared/src/types';
import { generateNonOverlappingPositions } from './util';
import { Renderable } from 'src/render/components/renderable';
import Hyperspace from 'src/render/animations/hyperspace';
// import { Renderable } from 'src/render/components/renderable';

const allBots = [
  { type: 2 },
  { type: 2 },
  { type: 2 },
  { type: 2 },
  { type: 2 },
  { type: 2 },
  { type: 2 },
  { type: 2 },
];

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
  private players: Array<PlayerInfo> = [];
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
    this.projectileManager.setSingleCleanupCallback((eid) =>
      this.objectManager.removeBoundaryIndicator(eid!),
    );
    this.collisionHandler = new CollisionHandler(world, this.scene);
    this.collisionHandler.setProjectileDestroyedCallback((eid) => {
      this.projectileManager.removeProjectile(eid);
      this.objectManager.removeBoundaryIndicator(eid);
    });
    this.collisionHandler.setTargetDestroyedCallback((eid) => {
      this.getPlayerInfo(eid)!.isAlive = false;
    });
    this.inputHandler = new PlayerInputHandler(() => this.endTurn());
    this.indicator.setAnglePowerListener((angle, power) =>
      this.inputHandler.setAnglePower(angle, power),
    );
  }

  onCollision(eid1: number, eid2: number) {
    this.collisionHandler.handleCollision(eid1, eid2);
  }

  onCleanup(eid: number) {
    this.projectileManager.removeProjectile(eid);
  }

  startGame(justBots = true) {
    this.activePlayer = -1;
    this.turnInputs = [];
    const { players, objectPlacements } = runGameSetup(this.scene, this.world, {
      players: justBots
        ? allBots
        : [{ type: 0 }, { type: 1 }, { type: 2 }, { type: 1 }],
      playerColors: playerCols,
      minAsteroids: 1,
      maxAsteroids: 2,
    });

    this.players = players;
    this.allObjects = objectPlacements;
    this.startTurn();
  }

  private startTurn() {
    if (this.activePlayer < 0) {
      this.activePlayer = this.players[0].id;
    }
    const living = this.getLivingPlayers();
    if (living.length < 2) {
      gameBus.emit(
        GameEvents.GAME_END,
        living.map((player) => ({
          playerId: this.players.findIndex((p) => p.id === player.id),
          col: Renderable.col[player.id],
        })),
      );
      return;
    }
    const playerInfo = this.getPlayerInfo(this.activePlayer);
    if (playerInfo) {
      if (!playerInfo.isAlive) {
        return this.endTurn();
      }
      if (playerInfo.type !== PlayerTypes.HUMAN) {
        return this.endTurn();
      }
    }

    this.indicator.create();
    this.syncAnglePower();
    this.objectManager.hideAllchildren();

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
      }
    }
  }

  private firePhase() {
    this.objectManager.removeAllChildren();
    this.projectileManager.reset();
    this.world.movements = null;
    let didFire = false;
    this.turnInputs.forEach(({ playerId, angle, power, otherAction }) => {
      if (!otherAction) {
        this.projectileManager.fireFrom(playerId, angle, power);
        didFire = true;
      }
      if (otherAction === OtherActions.HYPERSPACE) {
        this.willHyperspace.push(playerId);
      }
    });
    this.history.push([...this.turnInputs]);
    this.turnInputs = [];
    if (!didFire) {
      this.postCombatPhase();
    }
  }

  private postCombatPhase() {
    this.turnInputs = [];
    if (this.willHyperspace.length) {
      this.willHyperspace.forEach((playerId) => this.useHyperspace(playerId));
      this.willHyperspace = [];
    }
    setTimeout(() => {
      this.startTurn();
    }, 2000);
  }

  private endTurn() {
    const playerInfo = this.getPlayerInfo(this.activePlayer);
    if (playerInfo && playerInfo.isAlive) {
      if (playerInfo.type === PlayerTypes.HUMAN) {
        this.indicator.remove();
        this.turnInputs.push({
          playerId: this.activePlayer,
          angle: this.inputHandler.getCurrentAngle(),
          power: this.inputHandler.getCurrentPower(),
          otherAction: this.inputHandler.getCurrentOtherAction(),
        });
        this.inputHandler.resetHyperspace();
      } else {
        const thisPlayerInput = generateTurn(
          this.world,
          playerInfo,
          this.getGameState(),
        );
        this.turnInputs.push(thisPlayerInput);
      }
    }

    const len = this.players.length;

    if (this.activePlayer === this.players[len - 1].id) {
      this.activePlayer = -1;
      this.firePhase();
    } else {
      this.activePlayer = this.activePlayer + 1;
      this.startTurn();
    }
  }

  private useHyperspace(eid: number) {
    // console.log('teleporting player %s (%s)', eid, Renderable.col[eid]);
    const playerInfo = this.getPlayerInfo(eid);
    if (!playerInfo || !playerInfo?.isAlive) {
      return;
    }
    const { width, height } = this.scene.scale;
    const radius = getRadius(eid);
    const [newPosition] = generateNonOverlappingPositions(
      width,
      height,
      [radius],
      objectClearance,
      this.allObjects,
    );
    const { x, y } = newPosition;
    const oldPos = getPosition(eid);
    new Hyperspace(this.scene, oldPos, radius, true).play(
      () => {
        setPosition(eid, -20, -20);
      },
      () => {
        new Hyperspace(this.scene, newPosition, radius, false).play(() => {
          setPosition(eid, newPosition);
          const thisObject = this.allObjects.find((obj) => obj.eid === eid);
          if (thisObject) {
            thisObject.x = x;
            thisObject.y = y;
          }
        });
      },
    );
  }

  private syncAnglePower(angle: number = 0, power: number = 20) {
    this.inputHandler.setAnglePower(angle, power);
    this.indicator.updateVector(angle, power);
  }

  private getPlayerInfo(eid: number) {
    return this.players.find(({ id }) => id === eid);
  }

  private getLivingPlayers() {
    return this.players.filter(({ isAlive }) => isAlive);
  }

  private getGameState() {
    return {
      lastTurnShots: this.world.movements,
      objectInfo: this.allObjects,
    } as GameState;
  }
}
