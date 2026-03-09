import generateTurn from 'shared/src/ai/generateTurn';
import { runGameSetup } from 'shared/src/content'
import { gameBus, GameEvents } from 'src/util';
import {
  TurnInput,
  OtherActions,
  PlayerInfo,
  PlayerTypes,
  GameConfig,
  GameObject,
  Backgrounds,
} from 'shared/src/types';
import Hyperspace from 'src/render/animations/hyperspace';
import { objectClearance } from '../gameSetup/placeEntities';
import { getSoundManager } from '../scenes';
import {
  getPosition,
  setPosition,
  generateNonOverlappingPositions,
  getColliders,
  getHyperLocus,
  wait,
  getGameObject,
  getAllObjects,
} from 'shared/src/utils';
import { BaseSceneManager } from './baseSceneManager';
import { Renderable } from 'shared/src/ecs/components';

// There is a 1 sec timeout between each turn. We use this time to do processing stuff
const TURN_TIME_GAP = 1000;

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
  // How much of the turn gap is remaining
  protected turnTimeGapRemaining = 0;

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
    const { players, bg } = runGameSetup(this.world, conf);
    this.backgroundArtManager.setBackground(bg || Backgrounds.STARS);
    this.scene.fxManager.update();
    this.isHyperspace = getHyperLocus(this.world) !== null;

    players
      // Sort so hardest bots are first, followed by easier bots, followed by humans
      // This lets us hide the bot turn generation time in the 1 second turn cooldown
      .sort((pa, pb) => pb.type - pa.type) 
      .forEach((player) => {
        player.stationEids.forEach((stationEid) => {
          this.stationOwners[stationEid] = player.idx;
          this.stationsActive[stationEid] = true;
          this.stations.push(stationEid);
        });
      })

    this.players = players;

    await this.simManager.startWorker();
    await this.simManager.initializeWorker(
      getColliders(this.world),
      this.world,
    );

    this.startPhase();
  }

  protected async startPhase() {
    if (!this.active) {
      return;
    }
    await wait(this.turnTimeGapRemaining);
    if (!this.active) {
      return;
    }
    this.turnTimeGapRemaining = TURN_TIME_GAP;
    this.activeStationIndex = 0;
    if (this.checkEndgameCondition()) {
      return;
    }
    this.startTurn();
  }

  protected startTurn() {
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

  protected async getPlayerInput() {
    const playerInfo = this.getActivePlayer();
    const currentStation = this.getActiveStation();
    if (playerInfo.type === PlayerTypes.HUMAN) {
      // This will be overridden and handled in the game manager
      return;
    }
    const lastTurn = this.isHyperspace
      ? null
      : this.getPreviousTurnInput(currentStation);

    const beforeGenerate = Date.now();
    const thisStationInput = await generateTurn(
      this.world,
      currentStation,
      this.getGameState(),
      lastTurn,
      (turnInput) => this.simManager.runSimulation(turnInput),
      playerInfo.type
    );
    const elapsed = Date.now() - beforeGenerate;
    this.decrementTimeGap(elapsed);
    
    if (thisStationInput.paths) {
      gameBus.emit(GameEvents.DEBUG_DRAW_PATH, {
        colour: Renderable.col[thisStationInput.stationId],
        paths: thisStationInput.paths,
      });
    }
    this.turnInputs.push(thisStationInput);
    this.endTurn();
  }

  protected async endTurn() {
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

    const hyperspacers = shouldHyperspace.map(getGameObject);

    const newPositions = generateNonOverlappingPositions(this.world, hyperspacers, objectClearance);

    await Promise.all(shouldHyperspace.map((eid, idx) => this.useHyperspace(eid, newPositions[idx])));
    this.willHyperspace = [];

    // We sneak in an updated map of colliders to the worker during the post-combat pause
    // This way, restarting the worker and rebuilding collider cache should be unnoticeable
    const beforeRestart = Date.now();
    await this.simManager.initializeWorker(
      getColliders(this.world),
      this.world,
    );

    this.decrementTimeGap(Date.now() - beforeRestart);
    this.startPhase();
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

  protected decrementTimeGap(ms?: number) {
    if (ms) {
      if (this.turnTimeGapRemaining > 0) {
        this.turnTimeGapRemaining = Math.max(this.turnTimeGapRemaining - ms, 0)
      }
    }
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
