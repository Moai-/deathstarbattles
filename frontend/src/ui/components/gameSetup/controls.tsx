import { NeonButton } from 'src/ui/styled';
import { useSetup } from './context';
import { useScenario } from './scenarioContext';
import { GameState, useGameState } from '../context';
import { getScenarioTypes } from 'src/content/scenarios';

export const SetupControls: React.FC = () => {
  const { players } = useSetup();
  const { items, scenario } = useScenario();
  const { setGameState } = useGameState();
  const startGame = () => {
    setGameState(GameState.INGAME, {
      justBots: false,
      players,
      items,
      itemRules: getScenarioTypes()[scenario].items,
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
