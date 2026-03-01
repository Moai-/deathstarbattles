import { AnyPoint, OtherActions, RawTurn, TurnInput } from 'shared/src/types';
import { getRandomBetween } from 'shared/src/utils';

export const addError = (turn: RawTurn, angleError = 10, powerError = 3) =>
  ({
    angle: Math.min(
      Math.max(turn.angle + getRandomBetween(-angleError, angleError), -180),
      180,
    ),
    power: Math.min(
      Math.max(turn.power + getRandomBetween(-powerError, powerError), 20),
      100,
    ),
  }) as RawTurn;

export const hyperspaceTurn = (stationId: number) =>
  ({
    stationId,
    angle: 0,
    power: 20,
    otherAction: OtherActions.HYPERSPACE,
  }) as TurnInput;

export const shotTurn = (
  stationId: number,
  turn: RawTurn,
  paths?: Array<Array<AnyPoint>>,
) =>
  ({
    ...turn,
    stationId,
    otherAction: null,
    paths,
  }) as TurnInput;
