import generateTurn from 'shared/src/ai/generateTurn';
import { runGameSetup } from '../gameSetup';
import { gameBus, GameEvents } from 'src/util';
import {
  TurnInput,
  OtherActions,
  PlayerInfo,
  PlayerTypes,
  GameConfig,
  GameObject,
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

  // Current station index, corresponding to this station's index in the `stations` array
  protected activeStationIndex = -1;
  // Players in the current game
  protected players: Array<PlayerInfo> = [];
  // Stations in the current game
  protected stations: Array<number> = [];
  // Station eid -> owner id number map
  protected stationOwners: Record<number, number> = {};
  // Station eid -> Whether the station is alive (bool)
  protected stationsActive: Record<number, boolean> = {};
  // Control inputs for just this turn
  protected turnInputs: Array<TurnInput> = [];
  // A history of all control inputs for each turn
  protected history: Array<Array<TurnInput>> = [];
  // A list of eids of stations that will hyperspace this turn
  protected willHyperspace: Array<number> = [];
  // Current turn idx
  protected numTurn = 0;
  // Whether we are in a hyperspace-type arena
  protected isHyperspace = false;
  // There is a 1 sec timeout between each turn. We use this time to do processing stuff
  protected turnTimeout = 1000;

  ready() {
    super.ready();
    this.numTurn = 0;
    this.activeStationIndex = -1;
    this.turnInputs = [];
  }

  destroy() {
    super.destroy();
    this.players = [];
    this.stations = [];
    this.stationOwners = {};
    this.stationsActive = {};
    this.history = [];
    this.turnInputs = [];
    this.willHyperspace = [];
    this.numTurn = 0;
    this.isHyperspace = false;
  }

  async startGame(conf: GameConfig) {
    this.ready();
    const { players } = runGameSetup(this.scene, this.world, conf)!;
    this.scene.fxManager.update();
    this.isHyperspace = getHyperLocus(this.world) !== null;

    players.forEach((player) => {
      player.stationEids.forEach((stationEid) => {
        this.stationOwners[stationEid] = player.idx;
        this.stationsActive[stationEid] = true;
        this.stations.push(stationEid);
      })
    })

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

  protected checkEndgameCondition() {
    const living = this.getLivingPlayers();
    if (living.length < 2) {
      gameBus.emit(
        GameEvents.GAME_END,
        living.map((player) => ({
          playerId: player.idx,
          col: Renderable.col[player.stationEids[0]],
        })),
      );
      return true;
    }
    return false;
  }

  protected startTurn() {

    if (this.activeStationIndex < 0) {
      this.activeStationIndex = 0;
    }
    if (this.checkEndgameCondition()) {
      return;
    }
    const playerInfo = this.getActivePlayer();
    if (playerInfo) {
      if (!playerInfo.isAlive) {
        this.endTurn();
        return;
      }
    }
    if (!this.stationsActive[this.getActiveStation()]) {
      this.endTurn();
      return;
    }
    this.getPlayerInput();
  }

  protected async endTurn() {
    const playerInfo = this.getActivePlayer();
    const currentStation = this.getActiveStation();
    if (playerInfo.isAlive && this.stationsActive[currentStation]) {
      if (playerInfo.type !== PlayerTypes.HUMAN) {
        const lastTurn = this.isHyperspace
          ? null
          : this.getPreviousTurnInput(currentStation);
        // console.time('generate turn for ' + currentStation)
        const thisStationInput = await generateTurn(
          this.world,
          currentStation,
          this.getGameState(),
          lastTurn,
          (turnInput) => this.simManager.runSimulation(turnInput),
          playerInfo.type
        );
        // console.timeEnd('generate turn for ' + currentStation);

        if (thisStationInput.paths) {
          gameBus.emit(GameEvents.DEBUG_DRAW_PATH, {
            colour: Renderable.col[thisStationInput.stationId],
            paths: thisStationInput.paths,
          });
        }
        this.turnInputs.push(thisStationInput);
      }
    }

    const len = this.stations.length;

    if (this.activeStationIndex === len - 1) {
      this.activeStationIndex = -1;
      this.firePhase();
    } else {
      this.activeStationIndex = this.activeStationIndex + 1;
      this.startTurn();
    }
  }

  protected firePhase() {
    this.numTurn = this.numTurn + 1;
    this.objectManager.removeAllChildren();
    this.projectileManager.reset();
    this.world.movements = null;
    let didFire = false;
    this.turnInputs.forEach(({ stationId, angle, power, otherAction }) => {
      if (!otherAction) {
        this.projectileManager.fireFrom(stationId, angle, power);
        didFire = true;
      }
      if (otherAction === OtherActions.HYPERSPACE) {
        this.willHyperspace.push(stationId);
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
      ? this.stations.filter((p) => !this.willHyperspace.includes(p))
      : this.willHyperspace;
  
    const { width, height } = this.scene.scale;

    const radii = shouldHyperspace.map(getRadius);

    const newPositions = generateNonOverlappingPositions(
      width,
      height,
      radii,
      objectClearance,
      this.world,
    );

    await Promise.all(shouldHyperspace.map((eid, idx) => this.useHyperspace(eid, newPositions[idx])));
    this.willHyperspace = [];

    // We sneak in an updated map of colliders to the worker during the post-combat pause
    // This way, restarting the worker and rebuilding collider cache should be unnoticeable
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

  protected async useHyperspace(eid: number, newPosition: GameObject) {
    return new Promise<void>((resolve) => {
      const playerInfo = this.getPlayerInfoFromStation(eid);

      if (!playerInfo || !playerInfo?.isAlive) {
        return resolve();
      }

      if (!this.stationsActive[eid]) {
        return resolve();
      }

      const {radius} = newPosition;

      const oldPos = getPosition(eid);
      new Hyperspace(this.scene, oldPos, radius, true).play(
        () => {
          setPosition(eid, -200, -200);
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

  protected getPlayerInfoFromStation(eid: number) {
    return this.players.find(({ idx }) => idx === this.stationOwners[eid])!;
  }

  protected getActivePlayer() {
    return this.getPlayerInfoFromStation(this.getActiveStation())
  }

  protected getActiveStation() {
    return this.stations[this.activeStationIndex];
  }

  protected getLivingPlayers() {
    return this.players.filter(({ isAlive }) => isAlive);
  }

  protected getPreviousTurnInput(eid: number) {
    if (this.history.length) {
      const lastTurn = this.history[this.history.length - 1];
      const thisPlayerInput = lastTurn.find(
        (inputs) => inputs.stationId === eid,
      );
      if (thisPlayerInput) {
        return thisPlayerInput;
      }
    }
    return null;
  }

  protected onStationDestroyed(eid: number) {
    const player = this.getPlayerInfoFromStation(eid);
    this.stationsActive[eid] = false;
    player.stationEids = player.stationEids.filter((liveEid) => liveEid !== eid);

    if (player.stationEids.length === 0) {
      player.isAlive = false;
    }
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
      targetDestroyedCallback: this.onStationDestroyed.bind(this),
      onEndTurnCallback: this.endTurn.bind(this),
      getTargetIdCallback: this.getActiveStation.bind(this),
    })

  }

}
