import {
  Backgrounds,
  GameState,
  SerializedScenario,
} from 'shared/src/types';
import {
  doCirclesOverlap,
  getColliders,
  getComponentName,
  getPosition,
  getRadius,
  setPosition,
} from 'shared/src/utils';
import { NULL_ENTITY } from 'shared/src/ecs/world';
import { query, getAllEntities, removeEntity, getEntityComponents, removeComponent, addComponent, hasComponent, entityExists } from 'bitecs';
import { ObjectTypes } from 'shared/src/types';
import { Position } from 'shared/src/ecs/components';
import { Collision } from 'shared/src/ecs/components';
import { ObjectInfo } from 'shared/src/ecs/components/objectInfo';
import { Player } from 'shared/src/ecs/components/player';
import { Projectile } from 'shared/src/ecs/components/projectile';
import { Destructible } from 'shared/src/ecs/components/destructible';
import { Active } from 'shared/src/ecs/components/active';
import { LeavesTrail } from 'src/render/components';
import { colToUi32 } from 'shared/src/utils';
import { playerCols } from 'shared/src/utils/colour';
import { serializeComponents, serializeScenario } from 'shared/src/ecs/serde/serialize';
import { instantiateScenario } from 'shared/src/ecs/serde/deserialize';

import { gameBus, loadScenario, saveScenario } from 'src/util';
import { getSoundManager } from '../scenes/resourceScene';
import * as ecsComponents from 'shared/src/ecs/components';
import { getDeathStarSizeIndex, getRemovedDestructibleEids, clearRemovedDestructibleEids, addRemovedDestructibleEid, getPersistTrails, getLabelTrails, getShotHistory, recordShot } from 'src/ui/components/editor';
import { BaseSceneManager } from './baseSceneManager';
import { EditorEvents } from 'src/util/event';
import { BASE_DEATHSTAR_RAD } from 'shared/src/content';
import { scenarioItemMap } from 'shared/src/content/objectManifest';

type PlacementState =
  | { mode: 'add'; objectType: ObjectTypes; ghostEid: number }
  | { mode: 'move'; eid: number; originalX: number; originalY: number }
  | null;


// This manager handles the editor. It can't really play the game,
// although there are a few functions that allow it to execute
// functions found in the game (like firing a shot)
export class EditorManager extends BaseSceneManager {

  // editor state
  private placementState: PlacementState = null;
  private escapeKey: Phaser.Input.Keyboard.Key | null = null;
  private shiftKey: Phaser.Input.Keyboard.Key | null = null;
  private firingFromEid: number | null = null;
  private lastAngle = 90;
  private lastPower = 50;
  private workerUpdating = false;
  private workerUpdateRequested = false;

  private static posQuery = [Position];

  ready() {
    super.ready();
    this.enableClickListeners();
    this.escapeKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC) ?? null;
    this.shiftKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT) ?? null;
    this.simManager.startWorker().then(this.updateWorker.bind(this));
  }

  update() {
    if (this.escapeKey?.isDown) {
      if (this.placementState) {
        this.abortPlacement();
        gameBus.emit(EditorEvents.ED_PH_ABORT_PLACE);
      } else if (this.firingFromEid !== null) {
        this.exitFireMode();
      }
    }
  }

  startPlaceEntity(objectType: ObjectTypes) {
    const creator = scenarioItemMap.get(objectType)?.generator;
    if (!creator) {
      console.log('editorManager: could not find creator for', ObjectTypes[objectType]);
      return;
    }
    const eid = creator(this.world, { x: 0, y: 0 });
    if (eid === NULL_ENTITY) return;
    if (ObjectInfo.type[eid] === ObjectTypes.DEATHSTAR) {
      const multiplier = getDeathStarSizeIndex() + 1;
      Collision.radius[eid] = BASE_DEATHSTAR_RAD * multiplier;
    }
    this.renderManager.setPendingGhostEid(eid);
    setPosition(eid, { x: 0, y: 0 });
    this.placementState = { mode: 'add', objectType, ghostEid: eid };
  }

  startMoveEntity(eid: number) {
    const pos = getPosition(eid);
    this.renderManager.setGhost(eid, true);
    this.placementState = { mode: 'move', eid, originalX: pos.x, originalY: pos.y };
  }

  private async updateWorker() {
    if (this.workerUpdating) {
      this.workerUpdateRequested = true;
      return;
    }
    this.workerUpdating = true;
    await this.simManager.initializeWorker(
      getColliders(this.world),
      this.world,
    );
    this.workerUpdating = false;
    if (this.workerUpdateRequested) {
      this.workerUpdateRequested = false;
      await this.updateWorker();
    }
  }

  private abortPlacement() {
    if (!this.placementState) return;
    if (this.placementState.mode === 'add') {
      removeComponent(this.world, this.placementState.ghostEid, Active);
      removeEntity(this.world, this.placementState.ghostEid);
      this.renderManager.removeObject(this.placementState.ghostEid);
    } else {
      setPosition(this.placementState.eid, {
        x: this.placementState.originalX,
        y: this.placementState.originalY,
      });
      this.renderManager.setGhost(this.placementState.eid, false);
    }
    this.placementState = null;
  }

  private commitPlacement(x: number, y: number) {
    if (!this.placementState) return;
    if (this.placementState.mode === 'add') {
      const eid = this.placementState.ghostEid;
      const objectType = this.placementState.objectType;
      setPosition(eid, { x, y });
      if (ObjectInfo.type[eid] === ObjectTypes.DEATHSTAR) {
        const multiplier = getDeathStarSizeIndex() + 1;
        Collision.radius[eid] = BASE_DEATHSTAR_RAD * multiplier;
        this.renderManager.refreshObject(eid);
      }
      this.renderManager.setGhost(eid, false);
      this.placementState = null;
      if (this.shiftKey?.isDown) {
        this.startPlaceEntity(objectType);
      }
    } else {
      setPosition(this.placementState.eid, { x, y });
      this.renderManager.setGhost(this.placementState.eid, false);
      this.placementState = null;
    }
    this.updateWorker();
  }

  private enableClickListeners() {
    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointermove', this.handlePointerMove, this);
  }

  private disableClickListeners() {
    this.scene.input.off('pointerdown');
    this.scene.input.off('pointermove');
    this.scene.input.off('pointerup');
    this.scene.input.off('pointerupoutside');
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    if (this.placementState) {
      if (pointer.rightButtonDown()) {
        this.abortPlacement();
        gameBus.emit(EditorEvents.ED_PH_ABORT_PLACE);
      } else if (pointer.leftButtonDown()) {
        this.commitPlacement(pointer.x, pointer.y);
      }
      return;
    }
    const ent = query(this.world, EditorManager.posQuery);
    const overlappingEntities: Array<number> = [];
    for (let i = 0; i < ent.length; i++) {
      const entity = ent[i];
      const pos = getPosition(entity);
      const rad = getRadius(entity) || 5;
      if (doCirclesOverlap(pointer.x, pointer.y, 2, pos.x, pos.y, rad)) {
        overlappingEntities.push(entity);
      }
    }
    const payload = {
      clickLoc: { x: pointer.x, y: pointer.y },
      entities: overlappingEntities.map((eid) => serializeComponents(this.world, eid)),
    };
    gameBus.emit(EditorEvents.ED_ENTITY_CLICKED, payload);
  }

  

  private handlePointerMove(pointer: Phaser.Input.Pointer) {
    if (this.placementState) {
      const eid = this.placementState.mode === 'add' ? this.placementState.ghostEid : this.placementState.eid;
      setPosition(eid, { x: pointer.x, y: pointer.y });
      this.renderManager.updateObjectPosition(eid, pointer.x, pointer.y);
      return;
    }
    const ent = query(this.world, EditorManager.posQuery);
    const overlappingEntities: Array<number> = [];
    for (let i = 0; i < ent.length; i++) {
      const entity = ent[i];
      const pos = getPosition(entity);
      const rad = getRadius(entity) || 5;
      if (doCirclesOverlap(pointer.x, pointer.y, 2, pos.x, pos.y, rad)) {
        overlappingEntities.push(entity);
      }
    }
    gameBus.emit(EditorEvents.ED_ENTITY_HOVERED, {
      clickLoc: { x: pointer.x, y: pointer.y },
      entities: overlappingEntities.map((eid) => serializeComponents(this.world, eid)),
    });
  }

  protected setUpListeners() {
    const {renderManager, projectileManager} = this;
    super.setUpListeners({
      singleCleanupCallback: (eid) => renderManager.removeBoundaryIndicator(eid!),
      projectileDestroyedCallback: (eid) => {
        projectileManager.removeProjectile(eid);
        renderManager.removeBoundaryIndicator(eid);
      }
    })

    gameBus.on(EditorEvents.ED_UI_PROP_CHANGED, ({eid, compIdx, propName, newVal}) => {
      const thisComp = getEntityComponents(this.world, eid)[compIdx];
      if (thisComp) {
        thisComp[propName][eid] = newVal;
        this.renderManager.refreshObject(eid);
      }
      this.updateWorker();
    });

    gameBus.on(EditorEvents.ED_UI_DELETE_ENTITY, ({ eid }) => {
      removeEntity(this.world, eid);
      gameBus.emit(EditorEvents.ED_PH_DELETE_ENTITY, { eid });
      this.updateWorker();
    });
    gameBus.on(EditorEvents.ED_UI_REMOVE_COMPONENT, ({ eid, compKey }) => {
      this.removeEntityComponent(eid, compKey);
      this.updateWorker();
    });

    gameBus.on(EditorEvents.ED_UI_START_PLACE_ENTITY, ({ objectType }) => {
      this.startPlaceEntity(objectType);
    });
    gameBus.on(EditorEvents.ED_UI_START_MOVE_ENTITY, ({ eid }) => {
      this.startMoveEntity(eid);
    });
    const onAbortPlace = () => this.abortPlacement();
    gameBus.on(EditorEvents.ED_UI_ABORT_PLACE, onAbortPlace);
    gameBus.on(EditorEvents.ED_PH_ABORT_PLACE, onAbortPlace);
    gameBus.on(EditorEvents.ED_UI_START_FIRE_SHOT, ({ eid }) => this.startFireShot(eid));
    gameBus.on(EditorEvents.ED_UI_FIRE_SHOT_CONFIRM, ({ eid, angle, power }) =>
      this.confirmFireShot(eid, angle, power),
    );
    gameBus.on(EditorEvents.ED_UI_FIRE_SHOT_CANCEL, () => this.exitFireMode());
    gameBus.on(EditorEvents.ED_UI_CLEAR_TRAILS, () => this.clearAllTrails());
    gameBus.on(EditorEvents.ED_UI_OPTIONS_DEATHSTAR_SIZE, ({ sizeIndex }) =>
      this.applyDeathStarSize(sizeIndex),
    );
    gameBus.on(EditorEvents.ED_UI_OPTIONS_ALL_DESTRUCTIBLE, ({ enabled }) =>
      this.setAllDestructible(enabled),
    );
    gameBus.on(EditorEvents.ED_UI_OPTIONS_BACKGROUND, ({ bgType }) => {
      this.backgroundArtManager.setBackground(bgType);
    });
    gameBus.on(EditorEvents.ED_UI_SAVE_SCENARIO, ({ name }) => this.saveScenario(name));
    gameBus.on(EditorEvents.ED_UI_LOAD_SCENARIO, ({ scenarioKey }) =>
      this.loadScenario(scenarioKey),
    );
  }

  protected clearListeners() {
    super.clearListeners();
    gameBus.off(EditorEvents.ED_UI_PROP_CHANGED);
    gameBus.off(EditorEvents.ED_UI_DELETE_ENTITY);
    gameBus.off(EditorEvents.ED_UI_REMOVE_COMPONENT);
    gameBus.off(EditorEvents.ED_UI_START_PLACE_ENTITY);
    gameBus.off(EditorEvents.ED_UI_START_MOVE_ENTITY);
    gameBus.off(EditorEvents.ED_UI_ABORT_PLACE);
    gameBus.off(EditorEvents.ED_PH_ABORT_PLACE);
    gameBus.off(EditorEvents.ED_UI_START_FIRE_SHOT);
    gameBus.off(EditorEvents.ED_UI_FIRE_SHOT_CONFIRM);
    gameBus.off(EditorEvents.ED_UI_FIRE_SHOT_CANCEL);
    gameBus.off(EditorEvents.ED_UI_CLEAR_TRAILS);
    gameBus.off(EditorEvents.ED_UI_OPTIONS_DEATHSTAR_SIZE);
    gameBus.off(EditorEvents.ED_UI_OPTIONS_ALL_DESTRUCTIBLE);
    gameBus.off(EditorEvents.ED_UI_OPTIONS_BACKGROUND);
    gameBus.off(EditorEvents.ED_UI_SAVE_SCENARIO);
    gameBus.off(EditorEvents.ED_UI_LOAD_SCENARIO);
    this.disableClickListeners();
  }

  private saveScenario(name: string) {
    const scenario = serializeScenario(this.world, this.backgroundArtManager.getCurrentBackground(), name);
    saveScenario(scenario, name);
  }

  private loadScenario(scenarioKey: string) {
    const scenario = loadScenario(scenarioKey);
    if (!scenario) {
      console.log('failed to load scenario', scenarioKey);
      return;
    }
    const eids = getAllEntities(this.world);
    for (const eid of eids) {
      removeEntity(this.world, eid);
    }
    this.renderManager.removeAllBoundaryIndicators();
    this.renderManager.removeAllChildren();
    this.renderManager.removeAllObjects();
    instantiateScenario(scenario, this.world);
    this.backgroundArtManager.setBackground(scenario.background);
    this.updateWorker();
    gameBus.emit(EditorEvents.ED_SCENARIO_LOADED);
  }

  private static projectileQuery = [Projectile];

  private clearAllTrails() {
    const projectiles = query(this.world, EditorManager.projectileQuery);
    for (const projEid of projectiles) {
      this.renderManager.removeChildren(projEid);
    }
  }

  private applyDeathStarSize(sizeIndex: number) {
    const multiplier = sizeIndex + 1;
    const eids = getAllEntities(this.world);
    for (const eid of eids) {
      if (ObjectInfo.type[eid] === ObjectTypes.DEATHSTAR) {
        Collision.radius[eid] = BASE_DEATHSTAR_RAD * multiplier;
        this.renderManager.refreshObject(eid);
      }
    }
  }

  private setAllDestructible(enabled: boolean) {
    const eids = getAllEntities(this.world);
    if (enabled) {
      for (const eid of Array.from(getRemovedDestructibleEids())) {
        if (entityExists(this.world, eid)) {
          addComponent(this.world, eid, Destructible);
          this.renderManager.refreshObject(eid);
        }
      }
      clearRemovedDestructibleEids();
    } else {
      for (const eid of eids) {
        if (hasComponent(this.world, eid, Active) && hasComponent(this.world, eid, Destructible)) {
          removeComponent(this.world, eid, Destructible);
          addRemovedDestructibleEid(eid);
          this.renderManager.refreshObject(eid);
        }
      }
    }
  }

  getGameState() {
    return {
      lastTurnShots: this.world.movements,
    } as GameState;
  }

  private startFireShot(eid: number) {
    this.firingFromEid = eid;
    this.indicator.radius = 30 * (Collision.radius[eid] / 8);
    this.indicator.setGetTargetIdCallback(() => this.firingFromEid ?? 0);
    this.indicator.drawIndicator();
    this.syncAnglePower(this.lastAngle, this.lastPower);
    const { x, y } = getPosition(eid);
    gameBus.emit(EditorEvents.ED_FIRE_SHOT_READY, {
      eid,
      x,
      y,
      indicatorRadius: this.indicator.radius,
      initialAngle: this.lastAngle,
      initialPower: this.lastPower,
    });
  }

  private syncAnglePower(angle: number, power: number) {
    this.inputHandler.setAnglePower(angle, power);
    this.indicator.updateVector(angle, power);
  }

  private confirmFireShot(eid: number, angle: number, power: number) {
    this.lastAngle = angle;
    this.lastPower = power;
    const projEid = Player.pooledProjectile[eid];
    if (!getPersistTrails() && projEid !== undefined) {
      this.renderManager.removeChildren(projEid);
    }
    if (getLabelTrails() && projEid !== undefined) {
      const history = getShotHistory(eid);
      const colorIndex = history.length % playerCols.length;
      const trailColor = playerCols[colorIndex];
      LeavesTrail.col[projEid] = colToUi32(trailColor);
      recordShot(eid, angle, power, trailColor);
    }
    this.projectileManager.fireFrom(eid, angle, power);
    this.exitFireMode();
    const sm = getSoundManager(this.scene);
    sm.playSound('laserShot');
    sm.playSound('elecTravelHum');
  }

  private exitFireMode() {
    this.indicator.removeIndicator();
    this.firingFromEid = null;
    this.indicator.setGetTargetIdCallback(() => 0);
    gameBus.emit(EditorEvents.ED_FIRE_MODE_EXITED);
  }

  private static componentByName: Record<string, object> | null = null;

  private static getComponentByName(key: string): object | undefined {
    if (EditorManager.componentByName === null) {
      EditorManager.componentByName = {};
      for (const comp of Object.values(ecsComponents)) {
        if (comp && typeof comp === 'object') {
          const name = getComponentName(comp as object);
          if (name) EditorManager.componentByName[name] = comp as object;
        }
      }
    }
    return EditorManager.componentByName[key];
  }

  private removeEntityComponent(eid: number, compKey: string) {
    const comp = EditorManager.getComponentByName(compKey);
    if (!comp) return;
    removeComponent(this.world, eid, comp);
    this.renderManager.refreshObject(eid);
    const serialized = serializeComponents(this.world, eid);
    gameBus.emit(EditorEvents.ED_PH_COMPONENT_REMOVED, {
      eid,
      name: serialized.name,
      components: serialized.components,
    });
  }
}
