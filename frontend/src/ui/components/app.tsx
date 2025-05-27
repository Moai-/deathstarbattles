import Splash from './splash';
import ControlPanel from './controls';
import { useState } from 'react';
import { useStartBackground } from '../hooks/useStartBackground';
import { GameState } from '../types';
import { useGameLifecycle } from '../hooks/useGameLifecycle';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MAIN_MENU);

  useStartBackground(gameState === GameState.MAIN_MENU);
  useGameLifecycle(gameState);

  return (
    <>
      {gameState === GameState.MAIN_MENU && (
        <Splash onStart={() => setGameState(GameState.INGAME)} />
      )}
      {gameState === GameState.INGAME && <ControlPanel />}
    </>
  );
};

export default App;
