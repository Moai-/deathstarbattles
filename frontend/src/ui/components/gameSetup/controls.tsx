import { NeonButton } from 'src/ui/styled';
import { useSetup } from './context';
import { useScenario } from './scenarioContext';
import { startGameWithConfig } from 'src/ui/functions/gameManagement';
import { GameState, useGameState } from '../context';

export const SetupControls: React.FC = () => {
  const { players } = useSetup();
  const { items } = useScenario();
  const { setGameState } = useGameState();
  const startGame = () => {
    setGameState(GameState.INGAME);
    startGameWithConfig({
      justBots: false,
      players,
      items,
    });
  };
  return (
    <div
      style={{
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <NeonButton onClick={startGame}>Start Game</NeonButton>
    </div>
  );
};
