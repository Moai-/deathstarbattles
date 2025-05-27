import { useEffect } from 'react';
import { GameState } from '../types';
import { startGameWithConfig } from '../functions/startGame';

export const useGameLifecycle = (state: GameState) => {
  useEffect(() => {
    if (state === GameState.INGAME) {
      startGameWithConfig({ justBots: false });
    }
  }, [state]);
};
