import { OtherActions } from '../types';
export const MAX_DIST = 400;
export const MAX_DIST_SQ = MAX_DIST * MAX_DIST;
export const EMPTY_TURN = {
    playerId: -1,
    angle: 0,
    power: 20,
    otherAction: OtherActions.NONE,
};
