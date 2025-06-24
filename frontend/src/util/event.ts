import mitt from 'mitt';
import { OtherActions } from 'shared/src/types';
import { GameConfig } from 'src/ui/types';

export enum GameEvents {
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
}

type WinnerData = { col: number; playerId: number };

type GameVolume = {
  musicVolume?: number;
  effectsVolume?: number;
  mute?: boolean;
};

type EventData = {
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
};

export const gameBus = mitt<EventData>();
