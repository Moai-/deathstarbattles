import generateTurn from 'shared/src/ai/generateTurn';
import { runGameSetup } from '../gameSetup';
import { gameBus, GameEvents } from 'src/util';
import {
  TurnInput,
  OtherActions,
  PlayerInfo,
  PlayerTypes,
  GameConfig,
} from 'shared/src/types';
import { Renderable } from 'src/render/components/renderable';
import Hyperspace from 'src/render/animations/hyperspace';
import { objectClearance } from '../gameSetup/placeEntities';
import { getSoundManager } from '../scenes';
import {
  getRadius,
  getPosition,
  setPosition,
  generateNonOverlappingPositions,
  getColliders,
  getHyperLocus,
} from 'shared/src/utils';
import { BaseSceneManager } from './baseSceneManager';

// This manager is capable of running an automatic game with bots.
// It does not concern itself with players.
export class BaseGameManager extends BaseSceneManager {

  // game state
  protected activePlayerIndex = -1;
  protected players: Array<PlayerInfo> = [];
  protected history: Array<Array<TurnInput>> = [];
  protected turnInputs: Array<TurnInput> = [];
  protected willHyperspace: Array<number> = [];
  protected active = true;
  protected numTurn = 0;
  protected isHyperspace = false;

  ready() {
    super.ready();
    this.numTurn = 0;
    this.activePlayerIndex = -1;
    this.turnInputs = [];
  }

  async startGame(conf: GameConfig) {
    this.ready();
    const { players } = runGameSetup(this.scene, this.world, conf)!;
    this.scene.fxManager.update();
    this.isHyperspace = getHyperLocus(this.world) !== null;

    this.players = players;

    await this.simManager.startWorker();
    await this.simManager.initializeWorker(
      getColliders(this.world),
      this.world,
    );

    this.startTurn();
  }

  protected getPlayerInput() {
    // To be overridden by single game manager
    this.endTurn();
  }

  protected startTurn() {

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
        this.endTurn();
        return;
      }
    }
    this.getPlayerInput();
    return;
  }

  protected async endTurn() {
    const playerInfo = this.getActivePlayer();
    if (playerInfo.isAlive) {
      if (playerInfo.type !== PlayerTypes.HUMAN) {
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

  protected firePhase() {
    this.numTurn = this.numTurn + 1;
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
      sm.playSound('elecTravelHum');
    }
  }

  protected async postCombatPhase() {
    this.turnInputs = [];
    getSoundManager(this.scene).stopSound('elecTravelHum');
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
    this.simManager.shutdownWorker();
    await this.simManager.startWorker();
    await this.simManager.initializeWorker(
      getColliders(this.world),
      this.world,
    );

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

  protected async useHyperspace(eid: number) {
    return new Promise<void>((resolve) => {
      const playerInfo = this.getPlayerInfo(eid);

      if (!playerInfo || !playerInfo?.isAlive) {
        return resolve();
      }

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

  protected getPlayerInfo(eid: number) {
    return this.players.find(({ id }) => id === eid);
  }

  protected getActivePlayer() {
    return this.players[this.activePlayerIndex];
  }

  protected getLivingPlayers() {
    return this.players.filter(({ isAlive }) => isAlive);
  }

  protected getPreviousTurnInput(eid: number) {
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

  protected setUpListeners() {
    const {objectManager, projectileManager} = this;
    super.setUpListeners({
      // Set a tiny delay on post combat phase to allow collision manager
      // to properly resolve all destroyed stations
      cleanupCallback: () => setTimeout(() => this.postCombatPhase(), 10),
      singleCleanupCallback: (eid) => objectManager.removeBoundaryIndicator(eid!),
      projectileDestroyedCallback: (eid) => {
        projectileManager.removeProjectile(eid);
        objectManager.removeBoundaryIndicator(eid);
      },
      targetDestroyedCallback: (eid) => this.getPlayerInfo(eid)!.isAlive = false,
      onEndTurnCallback: () => this.endTurn(),
      getTargetIdCallback: () => this.players[this.activePlayerIndex].id,
    })

  }

}
