import React, { createContext, useContext, useEffect, useState } from 'react';
import { GameState } from '../types';
import { gameBus, GameEvents } from 'src/util';
import { GameConfig } from 'shared/src/types';
import { App, AppModes } from 'src/game';

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
      await App.stopMode(AppModes.BACKGROUND);
    }

    if (nextState !== GameState.EDITOR) {
      // Exiting editor; ensure editor is stopped.
      await App.stopMode(AppModes.EDITOR)
    }

    // Exit game -- gotta check if we are currently ingame.
    // Otherwise the GAME_END listener gets unset, which is used
    // for background game to get it to repeat.
    if (gameState === GameState.INGAME && nextState !== GameState.INGAME) {
      gameBus.off(GameEvents.GAME_END);
      await App.stopMode(AppModes.GAME);
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
      App.startMode(AppModes.GAME, conf);
    }

    if (nextState === GameState.EDITOR) {
      // Game editor is launching.
      // Not much we need to do here -- just launch the editor scene.
      App.startMode(AppModes.EDITOR);
    }

    if (backgroundGameStates.includes(nextState)) {
      // Main menu or config: let's launch the background game.
      App.startMode(AppModes.BACKGROUND);
    }

    setGameState(nextState);
  }

  // On game-start, move from FIRST_START to MAIN_MENU
  useEffect(() => {
    if (gameState === GameState.FIRST_START) {
      App.createGame().then(() => handleStateSwitch(GameState.MAIN_MENU))
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
