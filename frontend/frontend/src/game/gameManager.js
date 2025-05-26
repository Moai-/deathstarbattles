import generateTurn from 'shared/src/ai/generateTurn';
import { FiringIndicator } from './firingIndicator';
import { PlayerInputHandler } from './playerInput';
import { objectClearance, runGameSetup } from './gameSetup';
import playerCols from './playerCols';
import { ProjectileManager } from './projectileManager';
import { getRadius, setPosition } from '../util';
import { CollisionHandler } from './collisionHandler';
import { OtherActions, PlayerTypes, } from 'shared/src/types';
import { generateNonOverlappingPositions } from './util';
export default class GameManager {
    constructor(scene, world, objectManager) {
        // game state
        this.activePlayer = -1;
        this.players = [];
        this.allObjects = [];
        this.history = [];
        this.turnInputs = [];
        this.willHyperspace = [];
        this.scene = scene;
        this.world = world;
        this.objectManager = objectManager;
        this.indicator = new FiringIndicator(scene, () => this.activePlayer);
        this.projectileManager = new ProjectileManager(world);
        this.projectileManager.setCleanupCallback(() => this.postCombatPhase());
        this.projectileManager.setSingleCleanupCallback((eid) => this.objectManager.removeBoundaryIndicator(eid));
        this.collisionHandler = new CollisionHandler(world);
        this.collisionHandler.setProjectileDestroyedCallback((eid) => {
            this.projectileManager.removeProjectile(eid);
            this.objectManager.removeBoundaryIndicator(eid);
        });
        this.collisionHandler.setTargetDestroyedCallback((eid) => {
            this.getPlayerInfo(eid).isAlive = false;
        });
        this.inputHandler = new PlayerInputHandler('angle', 'power', 'endtn', 'hyper', (angle, power) => this.indicator.updateVector(angle, power), () => this.endTurn(), () => { });
    }
    create() {
        this.scene.input.on('pointerdown', (p) => this.indicator.handlePointerClick(p, (angle, power) => {
            this.inputHandler.setAnglePower(angle, power);
        }));
    }
    onCollision(eid1, eid2) {
        this.collisionHandler.handleCollision(eid1, eid2);
    }
    onCleanup(eid) {
        this.projectileManager.removeProjectile(eid);
    }
    startGame() {
        const { players, objectPlacements } = runGameSetup(this.scene, this.world, {
            players: [{ type: 0 }, { type: 1 }, { type: 2 }],
            playerColors: playerCols,
            minAsteroids: 1,
            maxAsteroids: 2,
        });
        this.players = players;
        this.allObjects = objectPlacements;
        this.startTurn();
    }
    startTurn() {
        if (this.activePlayer < 0) {
            this.activePlayer = 0;
        }
        const living = this.getLivingPlayers();
        if (living.length < 2) {
            console.log('player %s wins', living[0].id);
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
            const thisPlayerInput = lastTurn.find((inputs) => inputs.playerId === this.activePlayer);
            if (thisPlayerInput) {
                const { angle, power } = thisPlayerInput;
                this.syncAnglePower(angle, power);
                if (thisPlayerInput.otherAction !== OtherActions.HYPERSPACE) {
                    const parent = this.projectileManager.getByPlayerId(this.activePlayer);
                    if (parent) {
                        this.objectManager.showChildren(parent.ownId);
                    }
                }
            }
        }
    }
    firePhase() {
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
    postCombatPhase() {
        this.turnInputs = [];
        setTimeout(() => {
            if (this.willHyperspace.length) {
                this.willHyperspace.forEach((playerId) => this.useHyperspace(playerId));
                setTimeout(() => {
                    this.willHyperspace = [];
                    this.startTurn();
                }, 200);
            }
            else {
                this.startTurn();
            }
        }, 1500);
    }
    endTurn() {
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
            }
            else {
                const thisPlayerInput = generateTurn(this.world, playerInfo, this.getGameState());
                this.turnInputs.push(thisPlayerInput);
            }
        }
        if (this.activePlayer + 1 === this.players.length) {
            this.activePlayer = -1;
            this.firePhase();
        }
        else {
            this.activePlayer = this.activePlayer + 1;
            this.startTurn();
        }
    }
    useHyperspace(eid) {
        const { width, height } = this.scene.scale;
        const [newPosition] = generateNonOverlappingPositions(width, height, [getRadius(eid)], objectClearance, this.allObjects);
        const { x, y } = newPosition;
        setPosition(eid, x, y);
        this.allObjects[eid].x = x;
        this.allObjects[eid].y = y;
    }
    syncAnglePower(angle = 0, power = 20) {
        this.inputHandler.setAnglePower(angle, power);
        this.indicator.updateVector(angle, power);
    }
    getPlayerInfo(eid) {
        return this.players.find(({ id }) => id === eid);
    }
    getLivingPlayers() {
        return this.players.filter(({ isAlive }) => isAlive);
    }
    getGameState() {
        return {
            lastTurnShots: this.world.movements,
            objectInfo: this.allObjects,
        };
    }
}
