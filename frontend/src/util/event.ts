import mitt from 'mitt';
import { OtherActions } from 'shared/src/types';

export enum GameEvents {
  END_TURN = 'endturn',
  ANGLE_POWER_GAME = 'apgame',
  ANGLE_POWER_UI = 'apui',
  OTHER_ACTION = 'otheraction',
}

type EventData = {
  [GameEvents.END_TURN]: void;
  [GameEvents.ANGLE_POWER_UI]: { angle: number; power: number };
  [GameEvents.ANGLE_POWER_GAME]: { angle: number; power: number };
  [GameEvents.OTHER_ACTION]: OtherActions;
};

export const gameBus = mitt<EventData>();
