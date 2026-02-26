import mitt from 'mitt';
import { AnyPoint, GameConfig, ObjectTypes, OtherActions } from 'shared/src/types';
import { SerializedEntity } from 'shared/src/utils';

export enum GameEvents {
  // Game stuff
  END_TURN = 'endturn',
  ANGLE_POWER_GAME = 'apgame',
  ANGLE_POWER_UI = 'apui',
  OTHER_ACTION_UI = 'otheractionui',
  OTHER_ACTION_GAME = 'otheractiongame',
  SET_VOLUME = 'setvolume',
  SCENE_LOADED = 'sceneloaded',
  START_GAME = 'startgame',
  GAME_END = 'gameend',
  GAME_LOADED = 'gameloaded',
  GAME_REMOVED = 'gameremoved',
  DEBUG_DRAW_PATH = 'debugdrawpath',

  // Editor stuff
  ED_ADD_ENTITY = 'ed_addentity',
  ED_ENTITY_CLICKED = 'ed_entityclicked',
  ED_UI_PROP_CHANGED = 'ed_ui_propchanged',
  ED_UI_DELETE_ENTITY = 'ed_ui_deleteentity',
  ED_PH_DELETE_ENTITY = 'ed_ph_deleteentity',
  ED_UI_REMOVE_COMPONENT = 'ed_ui_removecomponent',
  ED_PH_COMPONENT_REMOVED = 'ed_ph_componentremoved',

  // Editor placement (ghost-follow-cursor then place / abort)
  ED_UI_START_PLACE_ENTITY = 'ed_ui_startplaceentity',
  ED_UI_START_MOVE_ENTITY = 'ed_ui_startmoveentity',
  ED_UI_ABORT_PLACE = 'ed_ui_abortplace',
  ED_PH_ABORT_PLACE = 'ed_ph_abortplace',

  // Editor fire shot (Death Star)
  ED_UI_START_FIRE_SHOT = 'ed_ui_startfireshot',
  ED_FIRE_SHOT_READY = 'ed_fireshotready',
  ED_UI_FIRE_SHOT_CONFIRM = 'ed_ui_fireshotconfirm',
  ED_UI_FIRE_SHOT_CANCEL = 'ed_ui_fireshotcancel',
  ED_FIRE_MODE_EXITED = 'ed_firemodeexited',
}

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
  entities: Array<SerializedEntity>
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
  components: SerializedEntity['components']
}

export type PropChanged = EntityIdPayload & {
  compIdx: number,
  propName: string,
  newVal: number,
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

type EventData = {
  // Game stuff
  [GameEvents.END_TURN]: void;
  [GameEvents.ANGLE_POWER_UI]: { angle: number; power: number };
  [GameEvents.ANGLE_POWER_GAME]: { angle: number; power: number };
  [GameEvents.OTHER_ACTION_UI]: OtherActions;
  [GameEvents.OTHER_ACTION_GAME]: OtherActions;
  [GameEvents.GAME_END]: Array<WinnerData>; // List of winners in case if there's multiple
  [GameEvents.START_GAME]: GameConfig;
  [GameEvents.SCENE_LOADED]: void;
  [GameEvents.GAME_REMOVED]: void;
  [GameEvents.GAME_LOADED]: void;
  [GameEvents.SET_VOLUME]: GameVolume;
  [GameEvents.DEBUG_DRAW_PATH]: DebugPath;

  // Editor stuff
  [GameEvents.ED_ADD_ENTITY]: AddEntityPayload;
  [GameEvents.ED_ENTITY_CLICKED]: SelectionClick;
  [GameEvents.ED_UI_PROP_CHANGED]: PropChanged;
  [GameEvents.ED_UI_DELETE_ENTITY]: EntityIdPayload;
  [GameEvents.ED_PH_DELETE_ENTITY]: EntityIdPayload;
  [GameEvents.ED_UI_REMOVE_COMPONENT]: RemoveComponentPayload;
  [GameEvents.ED_PH_COMPONENT_REMOVED]: ComponentRemovedPayload;
  [GameEvents.ED_UI_START_PLACE_ENTITY]: StartPlaceEntityPayload;
  [GameEvents.ED_UI_START_MOVE_ENTITY]: StartMoveEntityPayload;
  [GameEvents.ED_UI_ABORT_PLACE]: void;
  [GameEvents.ED_PH_ABORT_PLACE]: void;
  [GameEvents.ED_UI_START_FIRE_SHOT]: StartFireShotPayload;
  [GameEvents.ED_FIRE_SHOT_READY]: FireShotReadyPayload;
  [GameEvents.ED_UI_FIRE_SHOT_CONFIRM]: FireShotConfirmPayload;
  [GameEvents.ED_UI_FIRE_SHOT_CANCEL]: void;
  [GameEvents.ED_FIRE_MODE_EXITED]: void;
};

export const gameBus = mitt<EventData>();
