import React, { createContext, useContext, useEffect, useState } from 'react';
import { GameState } from '../types';
import { gameBus, GameEvents } from 'src/events';
import { GameConfig } from 'shared/src/types';
import { DeferredApp, AppModes } from '../deferredApp';

type WinnerData = { playerId: number; col: number };

const backgroundGameStates = [GameState.MAIN_MENU, GameState.CONFIG_GAME];

interface GameStateContextProps {
  gameState: GameState;
  setGameState: (value: GameState, config?: GameConfig) => void;
  winnerData: WinnerData | null;
  lastConfig: GameConfig | null;
}

const GameStateContext = createContext<GameStateContextProps | undefined>(
  undefined,
);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>(GameState.FIRST_START);
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null);
  const [lastConfig, setLastConfig] = useState<GameConfig | null>(null);

  // Functions to run when performing specific switches
  const handleStateSwitch = async (nextState:GameState, config?: GameConfig) => {

    // console.log(`${GameState[gameState]} -> ${GameState[nextState]}`)

    // We handle termination states first -- this way, when we launch scenes
    // afterward, we know for sure we will have a clean slate.
    if (!backgroundGameStates.includes(nextState)) {
      // Next state isn't one where the background game should be running.
      await DeferredApp.stopMode(AppModes.BACKGROUND);
    }

    if (nextState !== GameState.EDITOR) {
      // Exiting editor; ensure editor is stopped.
      await DeferredApp.stopMode(AppModes.EDITOR)
    }

    // Exit game and remove stale listener, if any.
    if (nextState !== GameState.INGAME) {
      await DeferredApp.stopMode(AppModes.GAME);
      gameBus.off(GameEvents.GAME_END);
    }

    // Now we can handle starting the various scenes.

    if (nextState === GameState.INGAME) {
      // Actual playable game is launching.
      const conf = config || lastConfig;

      if (!conf) {
        // This state switch can only happen when we have a config.
        throw new Error('Tried to start game without game config');
      }
      
      // Set up endgame listener to show post-game screen.
      gameBus.on(GameEvents.GAME_END, (winnerData) => {
        const winner = winnerData[0];
        setWinnerData(winner);

        handleStateSwitch(GameState.SCORESCREEN);
        gameBus.off(GameEvents.GAME_END);
      });

      // Remember this config
      setLastConfig(conf);

      // Start the game with provided or saved config.
      DeferredApp.startMode(AppModes.GAME, conf);
    }

    if (nextState === GameState.EDITOR) {
      // Game editor is launching.
      // Not much we need to do here -- just launch the editor scene.
      DeferredApp.startMode(AppModes.EDITOR);
    }

    if (backgroundGameStates.includes(nextState)) {
      // Main menu or config: let's launch the background game.
      if (gameState === GameState.FIRST_START) {
        // If this is a fresh start, we need to create the game before running background.
        DeferredApp.createGame().then(() => DeferredApp.startMode(AppModes.BACKGROUND));
      } else {
        // Not a fresh start, just play the background scene.
        DeferredApp.startMode(AppModes.BACKGROUND);
      }
    }

    setGameState(nextState);
  }

  // On game-start, move from FIRST_START to MAIN_MENU
  useEffect(() => {
    if (gameState === GameState.FIRST_START) {
      handleStateSwitch(GameState.MAIN_MENU);
    }
  })

  return (
    <GameStateContext.Provider value={{ gameState, setGameState: handleStateSwitch, winnerData, lastConfig }}>
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
