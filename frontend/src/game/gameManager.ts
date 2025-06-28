import { GameWorld } from 'shared/src/ecs/world';
import generateTurn from 'shared/src/ai/generateTurn';
import { GameObjectManager } from '../render/objectManager';
import { FiringIndicator } from './firingIndicator';
import { PlayerInputHandler } from './playerInput';
import { runGameSetup } from './gameSetup';
import { ProjectileManager } from './projectileManager';
import { gameBus, GameEvents } from '../util';
import { CollisionHandler } from './collisionHandler';
import {
  TurnInput,
  OtherActions,
  PlayerInfo,
  GameState,
  PlayerTypes,
  GameConfig,
} from 'shared/src/types';
import { Renderable } from 'src/render/components/renderable';
import Hyperspace from 'src/render/animations/hyperspace';
import { objectClearance } from './gameSetup/placeEntities';
import { getSoundManager } from './resourceScene';
import {
  getRadius,
  getPosition,
  setPosition,
  generateNonOverlappingPositions,
  noop,
  getColliders,
  getHyperLocus,
} from 'shared/src/utils';
import { SimManager } from 'shared/src/ai/simulation/manager';
import { GameScene } from './gameScene';

export default class GameManager {
  // globals
  private scene: GameScene;
  private world: GameWorld;

  // game components
  private indicator: FiringIndicator;
  private inputHandler: PlayerInputHandler;
  private collisionHandler: CollisionHandler;
  private projectileManager: ProjectileManager;
  private objectManager: GameObjectManager;
  private simManager: SimManager;

  // game state
  private activePlayerIndex = -1;
  private players: Array<PlayerInfo> = [];
  private history: Array<Array<TurnInput>> = [];
  private turnInputs: Array<TurnInput> = [];
  private willHyperspace: Array<number> = [];
  private active = true;
  private numTurn = 0;
  private isHyperspace = false;

  constructor(
    scene: GameScene,
    world: GameWorld,
    objectManager: GameObjectManager,
  ) {
    this.scene = scene;
    this.world = world;
    this.objectManager = objectManager;
    this.indicator = new FiringIndicator(scene);
    this.projectileManager = new ProjectileManager(world);
    this.simManager = new SimManager();
    this.collisionHandler = new CollisionHandler(world, scene);
    this.inputHandler = new PlayerInputHandler();
  }

  create() {
    this.indicator.create();
    this.inputHandler.create();
    this.setUpListeners();
    this.active = true;
  }

  destroy() {
    this.clearListeners();
    this.indicator.destroy();
    this.inputHandler.destroy();
    this.projectileManager.destroy();
    this.active = false;
  }

  onCollision(eid1: number, eid2: number, wasDestroyed: boolean) {
    return this.collisionHandler.handleCollision(eid1, eid2, wasDestroyed);
  }

  onCleanup(eid: number) {
    this.projectileManager.removeProjectile(eid);
  }

  async startGame(conf: GameConfig) {
    this.active = true;
    this.numTurn = 0;
    this.activePlayerIndex = -1;
    this.turnInputs = [];
    // console.time('initial setup');
    const { players } = runGameSetup(this.scene, this.world, conf)!;
    this.scene.fxManager.update();
    this.isHyperspace = getHyperLocus(this.world) !== null;
    // console.timeEnd('initial setup');

    this.players = players;

    // console.time('start and init worker');
    await this.simManager.startWorker();
    await this.simManager.initializeWorker(
      getColliders(this.world),
      this.world,
    );
    // console.timeEnd('start and init worker');

    this.startTurn();
  }

  private startTurn() {
    if (this.activePlayerIndex < 0) {
      this.activePlayerIndex = 0;
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
    const playerInfo = this.getActivePlayer();
    if (playerInfo) {
      if (!playerInfo.isAlive) {
        return this.endTurn();
      }
      if (playerInfo.type !== PlayerTypes.HUMAN) {
        return this.endTurn();
      }
    }

    this.indicator.drawIndicator();
    this.syncAnglePower();
    this.objectManager.hideAllchildren();

    const thisPlayerInput = this.getPreviousTurnInput(playerInfo.id);

    if (thisPlayerInput) {
      const { angle, power } = thisPlayerInput;
      this.syncAnglePower(angle, power);
      if (thisPlayerInput.otherAction !== OtherActions.HYPERSPACE) {
        const parent = this.projectileManager.getByPlayerId(playerInfo.id);
        if (parent) {
          this.objectManager.showChildren(parent.ownId);
        }
      }
    }
  }

  private async endTurn() {
    const playerInfo = this.getActivePlayer();
    if (playerInfo.isAlive) {
      if (playerInfo.type === PlayerTypes.HUMAN) {
        this.indicator.removeIndicator();
        this.turnInputs.push({
          playerId: playerInfo.id,
          angle: this.inputHandler.getCurrentAngle(),
          power: this.inputHandler.getCurrentPower(),
          otherAction: this.inputHandler.getCurrentOtherAction(),
        });
        this.inputHandler.resetHyperspace();
      } else {
        // console.time('generate turn for ' + playerInfo.id);
        const lastTurn = this.isHyperspace
          ? null
          : this.getPreviousTurnInput(playerInfo.id);
        const thisPlayerInput = await generateTurn(
          this.world,
          playerInfo,
          this.getGameState(),
          lastTurn,
          (turnInput) => this.simManager.runSimulation(turnInput),
        );
        // console.timeEnd('generate turn for ' + playerInfo.id);

        if (thisPlayerInput.paths) {
          gameBus.emit(GameEvents.DEBUG_DRAW_PATH, {
            colour: Renderable.col[thisPlayerInput.playerId],
            paths: thisPlayerInput.paths,
          });
        }
        this.turnInputs.push(thisPlayerInput);
      }
    }

    const len = this.players.length;

    if (this.activePlayerIndex === len - 1) {
      this.activePlayerIndex = -1;
      this.firePhase();
    } else {
      this.activePlayerIndex = this.activePlayerIndex + 1;
      this.startTurn();
    }
  }

  private firePhase() {
    this.numTurn = this.numTurn + 1;
    // console.log('turn', this.numTurn);
    this.indicator.removeIndicator();
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
    } else {
      const sm = getSoundManager(this.scene);
      sm.playSound('laserShot');
      sm.playSound('travelHum');
    }
  }

  private async postCombatPhase() {
    this.turnInputs = [];
    getSoundManager(this.scene).stopSound('travelHum');
    const shouldHyperspace = this.isHyperspace
      ? this.players
          .filter((p) => !this.willHyperspace.includes(p.id))
          .map((p) => p.id)
      : this.willHyperspace;
    if (shouldHyperspace.length) {
      await Promise.all(shouldHyperspace.map(this.useHyperspace.bind(this)));
      this.willHyperspace = [];
    }
    const beforeRestart = Date.now();
    // console.time('restart worker in post-combat');
    this.simManager.shutdownWorker();
    await this.simManager.startWorker();
    await this.simManager.initializeWorker(
      getColliders(this.world),
      this.world,
    );
    // console.timeEnd('restart worker in post-combat');

    const remaining = Date.now() - beforeRestart;
    setTimeout(
      () => {
        if (this.active) {
          this.startTurn();
        }
      },
      Math.max(1000 - remaining, 0),
    );
  }

  private async useHyperspace(eid: number) {
    return new Promise<void>((resolve) => {
      const playerInfo = this.getPlayerInfo(eid);

      if (!playerInfo || !playerInfo?.isAlive) {
        return resolve();
      }
      // console.log(
      //   'teleporting player %s (%s)',
      //   eid,
      //   Renderable.col[eid],
      //   playerInfo,
      // );

      const { width, height } = this.scene.scale;
      const radius = getRadius(eid);
      const [newPosition] = generateNonOverlappingPositions(
        width,
        height,
        [radius],
        objectClearance,
        this.world,
      );
      const oldPos = getPosition(eid);
      new Hyperspace(this.scene, oldPos, radius, true).play(
        () => {
          setPosition(eid, -20, -20);
        },
        () => {
          new Hyperspace(this.scene, newPosition, radius, false).play(() => {
            setPosition(eid, newPosition);
            resolve();
          });
        },
      );
    });
  }

  private syncAnglePower(angle: number = 0, power: number = 20) {
    this.inputHandler.setAnglePower(angle, power);
    this.indicator.updateVector(angle, power);
  }

  private getPlayerInfo(eid: number) {
    return this.players.find(({ id }) => id === eid);
  }

  private getActivePlayer() {
    return this.players[this.activePlayerIndex];
  }

  private getLivingPlayers() {
    return this.players.filter(({ isAlive }) => isAlive);
  }

  private isPlayerAlive(eid: number) {
    return this.getPlayerInfo(eid)?.isAlive;
  }

  private getPreviousTurnInput(eid: number) {
    if (this.history.length) {
      const lastTurn = this.history[this.history.length - 1];
      const thisPlayerInput = lastTurn.find(
        (inputs) => inputs.playerId === eid,
      );
      if (thisPlayerInput) {
        return thisPlayerInput;
      }
    }
    return null;
  }

  private setUpListeners() {
    // Set a tiny delay on post combat phase to allow collision manager
    // to properly resolve all destroyed stations
    this.projectileManager.setCleanupCallback(() =>
      setTimeout(() => this.postCombatPhase(), 10),
    );
    this.projectileManager.setSingleCleanupCallback((eid) =>
      this.objectManager.removeBoundaryIndicator(eid!),
    );
    this.collisionHandler.setProjectileDestroyedCallback((eid) => {
      this.projectileManager.removeProjectile(eid);
      this.objectManager.removeBoundaryIndicator(eid);
    });
    this.collisionHandler.setTargetDestroyedCallback((eid) => {
      this.getPlayerInfo(eid)!.isAlive = false;
    });
    this.inputHandler.setOnEndTurnCallback(() => this.endTurn());
    this.indicator.setGetTargetIdCallback(
      () => this.players[this.activePlayerIndex].id,
    );
    this.indicator.setAnglePowerListener((angle, power) =>
      this.inputHandler.setAnglePower(angle, power),
    );
  }

  private clearListeners() {
    this.projectileManager.setCleanupCallback(noop);
    this.projectileManager.setSingleCleanupCallback(noop);
    this.collisionHandler.setProjectileDestroyedCallback(noop);
    this.collisionHandler.setTargetDestroyedCallback(noop);
    this.inputHandler.setOnEndTurnCallback(noop);
    this.indicator.setAnglePowerListener(noop);
    this.indicator.setGetTargetIdCallback(() => 0);
  }

  getGameState() {
    return {
      lastTurnShots: this.world.movements,
    } as GameState;
  }
}
