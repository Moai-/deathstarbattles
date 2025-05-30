import Splash from './splash';
import ControlPanel from './controls';
import { useState } from 'react';
import { useStartBackground } from '../hooks/useStartBackground';
import { GameState } from '../types';
import { useGameLifecycle } from '../hooks/useGameLifecycle';
import WinrarScreen from './winrar';
import { SetupScreen } from './gameSetup';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MAIN_MENU);

  const displayBg = [GameState.MAIN_MENU, GameState.CONFIG_GAME].includes(
    gameState,
  );
  useStartBackground(displayBg);
  const { winnerInfo } = useGameLifecycle(gameState, setGameState);

  return (
    <>
      {gameState === GameState.MAIN_MENU && (
        <Splash onStart={() => setGameState(GameState.CONFIG_GAME)} />
      )}
      {gameState === GameState.CONFIG_GAME && <SetupScreen />}
      {gameState === GameState.INGAME && <ControlPanel />}
      {gameState === GameState.SCORESCREEN && (
        <WinrarScreen
          playerNum={winnerInfo?.playerId || 0}
          col={winnerInfo?.col || 0}
          onMenu={() => setGameState(GameState.MAIN_MENU)}
        />
      )}
    </>
  );
};

export default App;
