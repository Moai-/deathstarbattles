import { GameWorld } from './ecs/world';

export enum OtherActions {
  NONE,
  HYPERSPACE,
}

export enum PlayerTypes {
  HUMAN,
  BOT_TRIVIAL,
  BOT_EASY,
  BOT_MEDIUM,
  BOT_HARD,
  BOT_INSANE,
}

export type PlayerSetup = {
  id: number;
  type: number;
  color: number;
  difficulty: number;
};

export interface AnyPoint {
  x: number;
  y: number;
}

export type TurnInput = {
  playerId: number;
  angle: number;
  power: number;
  otherAction?: OtherActions | null;
};

export type ClearanceFunction = (a: number, b: number) => number;

export type GameObject = { x: number; y: number; radius: number; eid: number };

export type PlayerInfo = {
  isAlive: boolean;
  type: PlayerTypes;
  id: number;
};

export type GameSetupConfig = {
  players: Array<Pick<PlayerInfo, 'type'>>;
  playerColors: Array<number>;
  minAsteroids: number;
  maxAsteroids: number;
};

export type GameSetupResult = {
  players: Array<PlayerInfo>;
  objectPlacements: Array<GameObject>;
};

export type ObjectMovements = {
  [key: number]: {
    id: number;
    movementTrace: Array<AnyPoint>;
  };
} | null;

export type GameState = {
  objectInfo: Array<GameObject>;
  lastTurnShots: ObjectMovements;
};

export type TurnGenerator = (
  world: GameWorld,
  playerInfo: PlayerInfo,
  gameState: GameState,
) => TurnInput;
