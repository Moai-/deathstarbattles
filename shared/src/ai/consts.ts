import { OtherActions, TurnInput } from '../types';

export const MAX_DIST = 100;
export const MAX_DIST_SQ = MAX_DIST * MAX_DIST;
export const EMPTY_TURN: TurnInput = {
  playerId: -1,
  angle: 0,
  power: 20,
  otherAction: OtherActions.NONE,
};
