export enum OtherActions {
  NONE,
  HYPERSPACE,
}

export type TurnInput = {
  playerId: number;
  angle: number;
  power: number;
  otherAction?: OtherActions | null;
};

export type ClearanceFunction = (a: number, b: number) => number;

export type GameObject = { x: number; y: number; radius: number; eid: number };

export type GameSetupConfig = {
  playerCount: number;
  playerColors: number[];
  minAsteroids: number;
  maxAsteroids: number;
};

export type GameSetupResult = {
  playerIds: number[];
  asteroidIds: number[];
  objectPlacements: GameObject[];
};
