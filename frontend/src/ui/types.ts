import { ObjectTypes, PlayerSetup } from 'shared/src/types';

export enum GameState {
  MAIN_MENU,
  CONFIG_GAME,
  INGAME,
  SCORESCREEN,
}

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

export enum ObjectAmounts {
  RAN_8,
  RAN_16,
  RAN_24,
}
