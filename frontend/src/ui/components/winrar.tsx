import { toHTMLHex } from '../functions/utils';
import { NeonButton } from '../styled';
import { WinnerScreen } from '../styled/containers';
import { GameState, useGameState } from './context';

const WinrarScreen: React.FC = () => {
  const { setGameState, winnerData } = useGameState();

  if (!winnerData) {
    return null;
  }
  const { playerId, col } = winnerData;
  return (
    <WinnerScreen>
      <h1 style={{ color: toHTMLHex(col) }}>Player {playerId + 1} wins!</h1>
      <NeonButton onClick={() => setGameState(GameState.MAIN_MENU)}>
        Menu
      </NeonButton>
    </WinnerScreen>
  );
};

export default WinrarScreen;
