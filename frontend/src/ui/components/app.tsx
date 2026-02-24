import Splash from './splash';
import ControlPanel from './controls';
import { useStartBackground } from '../hooks/useStartBackground';
import { GameState } from '../types';
import WinrarScreen from './winrar';
import { SetupScreen } from './basicSetup';
import { GameStateProvider, useGameState } from './context';
import { useUiInsets } from '../hooks/useUiInsets';
import { EditorScreen } from './editor/editor';

const App: React.FC = () => {
  useUiInsets();
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
      {gameState === GameState.EDITOR && <EditorScreen />}
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
