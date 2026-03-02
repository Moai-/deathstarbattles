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
  ANOMALY,
  LOCUS,
  TUNNEL_LOCUS,
  NEUTRON_STAR,
  JET_BLACK_HOLE,
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
  stationId: number;
  angle: number;
  power: number;
  otherAction?: OtherActions | null;
  paths?: Array<Array<AnyPoint>>;
};

export type ClearanceFunction = (a: number, b: number) => number;

export type GameObject = { x: number; y: number; radius: number; eid: number };

export type PlayerInfo = {
  idx: number;
  isAlive: boolean;
  type: PlayerTypes;
  stationEids: Array<number>;
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

export type TraceBuffer = {
  x: Int16Array,
  y: Int16Array,
}

export type TransferableTraceBuffer = {
  x: ArrayBuffer;
  y: ArrayBuffer;
}

export type GameState = {
  lastTurnShots: ObjectMovements | null;
};

export type TurnGenerator = (
  world: GameWorld,
  stationId: number,
  gameState: GameState,
  lastTurnInput: TurnInput | null,
  simulator: (t: TurnInput) => Promise<SimShotResult>,
  type?: PlayerTypes,
) => Promise<TurnInput>;

export type ShotInfo = {
  hitsEid: number;
  destructible: boolean;
  willHit: boolean;
  closestDestructible: number;
  closestPoint: AnyPoint;
  closestDist2: number;
  shotDist2: number;
};

export type SimShotResult = ShotInfo & {
  collisionT: number | null;
  input: RawTurn;
  shotTrail: Array<AnyPoint>;
  buffer?: TransferableTraceBuffer;
  hitsSelf: boolean;
  pointCount: number;
};

export type RawTurn = Pick<TurnInput, 'angle' | 'power'>;

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
  stationPerPlayer?: number;
  items?: Array<ScenarioItem>;
  itemRules?: Array<ScenarioItemRule>;
  background?: Backgrounds;
  stationSize?: number;
  maxItems?: number;
  numItems?: number;
};

export type TargetCacheEntry = {
  x: number;
  y: number;
  eid: number;
  r: number;
  r2: number;
  breaks: boolean;
  ally?: boolean;
};

export type TargetCache = Array<TargetCacheEntry>;

export type ScenarioType = {
  name: string;
  items: Array<ScenarioItemRule>;
  background?: Backgrounds;
};

export enum Backgrounds {
  NONE,
  STARS,
  SHARDS,
  DEEPSPACE,
  NEBULAR,
}
