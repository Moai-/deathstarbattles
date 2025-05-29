export enum GameState {
  MAIN_MENU,
  CONFIG_GAME,
  INGAME,
  SCORESCREEN,
}

export type GameConfig = {
  justBots: boolean;
};
