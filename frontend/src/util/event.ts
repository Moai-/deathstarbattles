import mitt, { type Emitter } from 'mitt';
import { AnyPoint, Backgrounds, EditorEntity, GameConfig, ObjectTypes, OtherActions } from 'shared/src/types';
import { AppScenes } from 'src/game';

type WinnerData = { col: number; playerId: number };

type GameVolume = {
  musicVolume?: number;
  effectsVolume?: number;
  mute?: boolean;
};

type DebugPath = {
  paths: Array<Array<AnyPoint>>;
  colour: number;
};

export type SelectionClick = {
  clickLoc: AnyPoint,
  entities: Array<EditorEntity>
}

export type EntityIdPayload = {
  eid: number,
}

export type RemoveComponentPayload = {
  eid: number
  compKey: string
}

export type ComponentRemovedPayload = {
  eid: number
  name: string
  components: EditorEntity['components']
}

export type PropChanged = EntityIdPayload & {
  compIdx: number,
  propName: string,
  newVal: unknown,
}

export type AddEntityPayload = {
  objectType: ObjectTypes
}

export type StartPlaceEntityPayload = {
  objectType: ObjectTypes
}

export type StartMoveEntityPayload = {
  eid: number
}

export type StartFireShotPayload = {
  eid: number
  x: number
  y: number
}

export type FireShotReadyPayload = {
  eid: number
  x: number
  y: number
  indicatorRadius: number
  initialAngle: number
  initialPower: number
}

export type FireShotConfirmPayload = {
  eid: number
  angle: number
  power: number
}

export enum GameEvents {
  // === Game stuff ===
  // controls
  ANGLE_POWER_GAME = 'apgame',
  ANGLE_POWER_UI = 'apui',
  OTHER_ACTION_UI = 'otheractionui',
  OTHER_ACTION_GAME = 'otheractiongame',
  SET_VOLUME = 'setvolume',
  // lifecycle
  SCENE_LOADED = 'sceneloaded',
  SCENE_UNLOADED = 'sceneunloaded',
  START_GAME = 'startgame',
  GAME_LOADED = 'gameloaded',
  GAME_REMOVED = 'gameremoved',
  GAME_END = 'gameend',
  // in-game events
  END_TURN = 'endturn',
  DEBUG_DRAW_PATH = 'debugdrawpath',
}

export enum EditorEvents {
  // === Editor stuff ===
  // ECS general management
  ED_ADD_ENTITY = 'ed_addentity',
  ED_ENTITY_CLICKED = 'ed_entityclicked',
  ED_UI_PROP_CHANGED = 'ed_ui_propchanged',
  ED_UI_DELETE_ENTITY = 'ed_ui_deleteentity',
  ED_PH_DELETE_ENTITY = 'ed_ph_deleteentity',
  ED_UI_REMOVE_COMPONENT = 'ed_ui_removecomponent',
  ED_PH_COMPONENT_REMOVED = 'ed_ph_componentremoved',
  // Entity placement
  ED_UI_START_PLACE_ENTITY = 'ed_ui_startplaceentity',
  ED_UI_START_MOVE_ENTITY = 'ed_ui_startmoveentity',
  ED_UI_ABORT_PLACE = 'ed_ui_abortplace',
  ED_PH_ABORT_PLACE = 'ed_ph_abortplace',
  // Fire shot
  ED_UI_START_FIRE_SHOT = 'ed_ui_startfireshot',
  ED_FIRE_SHOT_READY = 'ed_fireshotready',
  ED_UI_FIRE_SHOT_CONFIRM = 'ed_ui_fireshotconfirm',
  ED_UI_FIRE_SHOT_CANCEL = 'ed_ui_fireshotcancel',
  ED_FIRE_MODE_EXITED = 'ed_firemodeexited',
  // Editor options
  ED_UI_CLEAR_TRAILS = 'ed_ui_cleartrails',
  ED_UI_OPTIONS_DEATHSTAR_SIZE = 'ed_ui_options_deathstarsize',
  ED_UI_OPTIONS_ALL_DESTRUCTIBLE = 'ed_ui_options_alldestructible',
  ED_UI_OPTIONS_BACKGROUND = 'ed_ui_options_background',
  ED_ENTITY_HOVERED = 'ed_entityhovered',
  ED_UI_SAVE_SCENARIO = 'ed_ui_savescenario',
  ED_UI_LOAD_SCENARIO = 'ed_ui_loadscenario',
  ED_SCENARIO_LOADED = 'ed_scenarioloaded',
}

type EventData = {
  // === Game stuff ===
  // controls
  [GameEvents.ANGLE_POWER_UI]: { angle: number; power: number };
  [GameEvents.ANGLE_POWER_GAME]: { angle: number; power: number };
  [GameEvents.OTHER_ACTION_UI]: OtherActions;
  [GameEvents.OTHER_ACTION_GAME]: OtherActions;
  [GameEvents.SET_VOLUME]: GameVolume;
  // lifecycle
  [GameEvents.SCENE_LOADED]: void;
  [GameEvents.START_GAME]: GameConfig;
  [GameEvents.SCENE_UNLOADED]: AppScenes;
  [GameEvents.GAME_REMOVED]: void;
  [GameEvents.GAME_LOADED]: void;
  [GameEvents.GAME_END]: Array<WinnerData>;
  // in-game events
  [GameEvents.END_TURN]: void;
  [GameEvents.DEBUG_DRAW_PATH]: DebugPath;

  // === Editor stuff ===
  // ECS general management
  [EditorEvents.ED_ADD_ENTITY]: AddEntityPayload;
  [EditorEvents.ED_ENTITY_CLICKED]: SelectionClick;
  [EditorEvents.ED_UI_PROP_CHANGED]: PropChanged;
  [EditorEvents.ED_UI_DELETE_ENTITY]: EntityIdPayload;
  [EditorEvents.ED_PH_DELETE_ENTITY]: EntityIdPayload;
  [EditorEvents.ED_UI_REMOVE_COMPONENT]: RemoveComponentPayload;
  [EditorEvents.ED_PH_COMPONENT_REMOVED]: ComponentRemovedPayload;
  // Entity placement
  [EditorEvents.ED_UI_START_PLACE_ENTITY]: StartPlaceEntityPayload;
  [EditorEvents.ED_UI_START_MOVE_ENTITY]: StartMoveEntityPayload;
  [EditorEvents.ED_UI_ABORT_PLACE]: void;
  [EditorEvents.ED_PH_ABORT_PLACE]: void;
  // Fire shot
  [EditorEvents.ED_UI_START_FIRE_SHOT]: StartFireShotPayload;
  [EditorEvents.ED_FIRE_SHOT_READY]: FireShotReadyPayload;
  [EditorEvents.ED_UI_FIRE_SHOT_CONFIRM]: FireShotConfirmPayload;
  [EditorEvents.ED_UI_FIRE_SHOT_CANCEL]: void;
  [EditorEvents.ED_FIRE_MODE_EXITED]: void;
  // Editor options
  [EditorEvents.ED_UI_CLEAR_TRAILS]: void;
  [EditorEvents.ED_UI_OPTIONS_DEATHSTAR_SIZE]: { sizeIndex: number };
  [EditorEvents.ED_UI_OPTIONS_ALL_DESTRUCTIBLE]: { enabled: boolean };
  [EditorEvents.ED_UI_OPTIONS_BACKGROUND]: { bgType: Backgrounds };
  [EditorEvents.ED_ENTITY_HOVERED]: SelectionClick;
  [EditorEvents.ED_UI_SAVE_SCENARIO]: { name: string };
  [EditorEvents.ED_UI_LOAD_SCENARIO]: { scenarioKey: string };
  [EditorEvents.ED_SCENARIO_LOADED]: void;
};

type GameBus = Emitter<EventData> & {
  once<Key extends keyof EventData>(type: Key, handler: (data: EventData[Key]) => void): void;
};

const bus = mitt<EventData>();

(bus as GameBus).once = function once<Key extends keyof EventData>(
  type: Key,
  handler: (data: EventData[Key]) => void
): void {
  const wrapper = (data: EventData[Key]) => {
    bus.off(type, wrapper);
    handler(data);
  };
  bus.on(type, wrapper);
};

export const gameBus = bus as GameBus;

