import { GameWorld } from '../ecs/world';

// TODO: split into multiple files

// === Broad-application generics ===

export interface AnyPoint {
  x: number;
  y: number;
}

export type Eid = number;

export type Colour = { r: number; b: number; g: number };

// === Enums ===

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

export enum Backgrounds {
  NONE,
  STARS,
  DEEPSPACE,
  NEBULAR,
}

export enum ObjectPlacement {
  ANYWHERE = 'anywhere',
  DEAD_CENTER = 'dead_center',
  CLOSE_TO_CENTER = 'close_to_center',
  OUTSKIRTS = 'outskirts',
  SUPERGIANT = 'supergiant'
}

// === Game setup ===

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
  savedScenario?: SerializedScenario;
};

export type PlayerSetup = {
  id: number;
  type: number;
  col: number;
  difficulty: number;
};

export type GameSetupResult = {
  players: Array<PlayerInfo>;
  objectPlacements: Array<GameObject>;
};

export type ClearanceFunction = (a: number, b: number) => number;

export type GameObject = { x: number; y: number; radius: number; eid: number };
export type UnplacedGameObject = Omit<GameObject, 'x' | 'y'> & { placement?: ObjectPlacement};

export type EntityGenerator<EntityProps = {}> = (
  world: GameWorld,
  pos: AnyPoint,
  props?: EntityProps
) => number;

// === In-game stuff ===

export type GameState = {
  lastTurnShots: ObjectMovements | null;
};

export type PlayerInfo = {
  idx: number;
  isAlive: boolean;
  type: PlayerTypes;
  stationEids: Array<number>;
};

export type RawTurn = Pick<TurnInput, 'angle' | 'power'>;

export type TurnInput = {
  stationId: number;
  angle: number;
  power: number;
  otherAction?: OtherActions | null;
  paths?: Array<Array<AnyPoint>>;
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

export type ObjectMovements = {
  [key: number]: {
    id: number;
    movementTrace: Array<AnyPoint>;
    destroyedTarget: number | null;
  };
};

// === Simulation stuff ===

export type TraceBuffer = {
  x: Int16Array,
  y: Int16Array,
}

export type TransferableTraceBuffer = {
  x: ArrayBuffer;
  y: ArrayBuffer;
}

export type SimShotResult = ShotInfo & {
  collisionT: number | null;
  input: RawTurn;
  shotTrail: Array<AnyPoint>;
  buffer?: TransferableTraceBuffer;
  hitsSelf: boolean;
  pointCount: number;
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


// === Serialize / deserialize ===

export interface ScenarioItem {
  id: number;
  type: ObjectTypes;
  amount: number;
}

export interface ScenarioItemRule {
  type: ObjectTypes;
  min?: number;
  max?: number;
  n?: number;
  p?: number;
  plc?: ObjectPlacement
}

export type ScenarioType = {
  name: string;
  items: Array<ScenarioItemRule>;
  background?: Backgrounds;
};

export type SerializedComponent = {
  key: string;
  props: {
    [key: string]: number | any;
  };
};

export type SerializedEntity = {
  eid: number;
  components: Array<SerializedComponent>;
};

export type EditorEntity = SerializedEntity & {
  name: string;
}

export type SerializedScenario = {
  name: string;
  background: Backgrounds;
  objects: Array<SerializedEntity>;
}

