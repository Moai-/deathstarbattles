import { useEffect, useState } from 'react';
import { GameState } from '../types';
import { gameBus, GameEvents } from 'src/util';
import { stopMainScene } from 'src/game';
import { useGameState } from '../components/context';

export const useGameLifecycle = () => {
  const { gameState, setGameState } = useGameState();
  const [winnerInfo, setWinnerInfo] = useState<{
    playerId: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    gameBus.on(GameEvents.GAME_END, (winnerData) => {
      if (gameState === GameState.INGAME) {
        const winner = winnerData[0];
        setWinnerInfo(winner);
        setGameState(GameState.SCORESCREEN);
        stopMainScene();
      }
    });
  });

  return {
    winnerInfo,
  };
};
