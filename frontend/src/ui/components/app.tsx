import Splash from './splash';
import ControlPanel from './controls';
import { GameState } from '../types';
import { WinnerPage } from './winner';
import { SetupScreen } from './basicSetup';
import { GameStateProvider, useGameState } from './context';
import { useUiInsets } from '../hooks/useUiInsets';
import { EditorScreen } from './editor';
import { Loading } from './loading';

const App: React.FC = () => {
  useUiInsets();
  const { gameState, isLoading } = useGameState();

  return (
    <>
      {isLoading && <Loading />}
      {gameState === GameState.MAIN_MENU && <Splash />}
      {gameState === GameState.CONFIG_GAME && <SetupScreen />}
      {gameState === GameState.INGAME && <ControlPanel />}
      {gameState === GameState.SCORESCREEN && <WinnerPage />}
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
