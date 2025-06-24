import React, { createContext, useContext, useEffect, useState } from 'react';
import { GameState } from '../types';
import { stopMainScene } from 'src/game';
import { gameBus, GameEvents } from 'src/util';

type WinnerData = { playerId: number; col: number };

interface GameStateContextProps {
  gameState: GameState;
  setGameState: (value: GameState) => void;
  winnerData: WinnerData | null;
}

const GameStateContext = createContext<GameStateContextProps | undefined>(
  undefined,
);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>(GameState.MAIN_MENU);
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null);
  useEffect(() => {
    if (gameState === GameState.INGAME) {
      gameBus.on(GameEvents.GAME_END, (winnerData) => {
        if (gameState === GameState.INGAME) {
          const winner = winnerData[0];
          setWinnerData(winner);
          setGameState(GameState.SCORESCREEN);
          stopMainScene();
        }
      });
    }
  }, [gameState]);

  return (
    <GameStateContext.Provider value={{ gameState, setGameState, winnerData }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context)
    throw new Error('useGameState must be used within GameStateProvider');
  return context;
};

export { GameState };
