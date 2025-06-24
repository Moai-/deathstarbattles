import { GameWorld } from '../ecs/world';

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

export enum ObjectTypes {
  NONE,
  DEATHSTAR,
  DEATHBEAM,
  ASTEROID,
  BLACK_HOLE,
  PLANET,
  STAR,
  SUPERGIANT,
  RED_GIANT,
  WHITE_DWARF,
  JOVIAN,
  WORMHOLE,
  BIG_WORMHOLE,
  WHITE_HOLE,
}

export type PlayerSetup = {
  id: number;
  type: number;
  col: number;
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
  paths?: Array<Array<AnyPoint>>;
};

export type ClearanceFunction = (a: number, b: number) => number;

export type GameObject = { x: number; y: number; radius: number; eid: number };

export type PlayerInfo = {
  isAlive: boolean;
  type: PlayerTypes;
  id: number;
};

export type GameSetupResult = {
  players: Array<PlayerInfo>;
  objectPlacements: Array<GameObject>;
};

export type ObjectMovements = {
  [key: number]: {
    id: number;
    movementTrace: Array<AnyPoint>;
    destroyedTarget: number | null;
  };
};

export type GameState = {
  objectInfo: Array<GameObject>;
  lastTurnShots: ObjectMovements | null;
};

export type TurnGenerator = (
  world: GameWorld,
  playerInfo: PlayerInfo,
  gameState: GameState,
  lastTurnInput: TurnInput | null,
) => TurnInput;

export type ShotInfo = {
  willHit: boolean;
  closest: number | null;
  dist2: number;
};

export interface ScenarioItem {
  id: number;
  type: ObjectTypes; // 'asteroid', 'planet', etc.
  amount: number;
}

export interface ScenarioItemRule {
  type: ObjectTypes;
  min?: number;
  max?: number;
  n?: number;
  p?: number;
}

export type GameConfig = {
  justBots?: boolean;
  players?: Array<PlayerSetup>;
  items?: Array<ScenarioItem>;
  itemRules?: Array<ScenarioItemRule>;
  maxItems?: number;
};

export type TargetCacheEntry = {
  x: number;
  y: number;
  eid: number;
  r2: number;
};

export type TargetCache = Array<TargetCacheEntry>;
