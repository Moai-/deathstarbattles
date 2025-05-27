import mitt from 'mitt';
import { OtherActions } from 'shared/src/types';
import { GameConfig } from 'src/ui/types';

export enum GameEvents {
  END_TURN = 'endturn',
  ANGLE_POWER_GAME = 'apgame',
  ANGLE_POWER_UI = 'apui',
  OTHER_ACTION = 'otheraction',
  SCENE_LOADED = 'sceneloaded',
  START_GAME = 'startgame',
  GAME_END = 'gameend',
}

type EventData = {
  [GameEvents.END_TURN]: void;
  [GameEvents.ANGLE_POWER_UI]: { angle: number; power: number };
  [GameEvents.ANGLE_POWER_GAME]: { angle: number; power: number };
  [GameEvents.OTHER_ACTION]: OtherActions;
  [GameEvents.GAME_END]: Array<number>; // List of winners in case if there's multiple
  [GameEvents.START_GAME]: GameConfig;
  [GameEvents.SCENE_LOADED]: void;
};

export const gameBus = mitt<EventData>();
