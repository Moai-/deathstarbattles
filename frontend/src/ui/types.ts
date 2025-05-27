export enum GameState {
  MAIN_MENU,
  CONFIG_GAME,
  INGAME,
}

export type GameConfig = {
  justBots: boolean;
};
