import { useEffect, useState } from 'react';
import { GameState } from '../types';
import { startGameWithConfig } from '../functions/gameManagement';
import { gameBus, GameEvents } from 'src/util';
import { destroyGame } from 'src/game';

export const useGameLifecycle = (
  state: GameState,
  setGameState: (g: GameState) => void,
) => {
  const [winnerInfo, setWinnerInfo] = useState<{
    playerId: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    gameBus.on(GameEvents.GAME_END, (winnerData) => {
      if (state === GameState.INGAME) {
        const winner = winnerData[0];
        setWinnerInfo(winner);
        setGameState(GameState.SCORESCREEN);
        destroyGame();
      }
    });
  });

  useEffect(() => {
    if (state === GameState.INGAME) {
      startGameWithConfig({ justBots: false });
    }
  }, [state]);

  return {
    winnerInfo,
  };
};
