import { PlayerSetup } from 'shared/src/types';

export enum GameState {
  MAIN_MENU,
  CONFIG_GAME,
  INGAME,
  SCORESCREEN,
}

export interface ScenarioItem {
  id: number;
  type: number; // 'asteroid', 'planet', etc.
  amount: number;
}

export type GameConfig = {
  justBots: boolean;
  players?: Array<PlayerSetup>;
  items?: Array<ScenarioItem>;
};
