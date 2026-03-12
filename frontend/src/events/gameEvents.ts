
export enum GameEvents {
  // === Game stuff ===
  // controls
  ANGLE_POWER_GAME = 'apgame',
  ANGLE_POWER_UI = 'apui',
  OTHER_ACTION_UI = 'otheractionui',
  OTHER_ACTION_GAME = 'otheractiongame',
  SET_VOLUME = 'setvolume',
  // lifecycle
  SCENE_LOADED = 'sceneloaded',
  SCENE_UNLOADED = 'sceneunloaded',
  START_GAME = 'startgame',
  GAME_LOADED = 'gameloaded',
  GAME_REMOVED = 'gameremoved',
  GAME_END = 'gameend',
  // in-game events
  END_TURN = 'endturn',
  DEBUG_DRAW_PATH = 'debugdrawpath',
}
