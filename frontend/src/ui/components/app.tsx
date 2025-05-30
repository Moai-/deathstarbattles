import Splash from './splash';
import ControlPanel from './controls';
import { useStartBackground } from '../hooks/useStartBackground';
import { GameState } from '../types';
import WinrarScreen from './winrar';
import { SetupScreen } from './gameSetup';
import { GameStateProvider, useGameState } from './context';

const App: React.FC = () => {
  const { gameState } = useGameState();

  const displayBg = [GameState.MAIN_MENU, GameState.CONFIG_GAME].includes(
    gameState,
  );
  useStartBackground(displayBg);

  return (
    <>
      {gameState === GameState.MAIN_MENU && <Splash />}
      {gameState === GameState.CONFIG_GAME && <SetupScreen />}
      {gameState === GameState.INGAME && <ControlPanel />}
      {gameState === GameState.SCORESCREEN && <WinrarScreen />}
    </>
  );
};

const WrappedApp: React.FC = () => {
  return (
    <GameStateProvider>
      <App />
    </GameStateProvider>
  );
};

export default WrappedApp;
