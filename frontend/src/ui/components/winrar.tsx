import { toHTMLHex } from '../functions/utils';
import { NeonButton } from '../styled';
import { WinnerContent, WinnerScreen } from '../styled/containers';
import { GameState, useGameState } from './context';

const WinrarScreen: React.FC = () => {
  const { setGameState, winnerData } = useGameState();

  if (!winnerData) {
    return (
      <WinnerScreen>
        <WinnerContent>
          <h1 style={{ color: 'white' }}>Nobody won! Total annihilation!</h1>
          <NeonButton onClick={() => setGameState(GameState.MAIN_MENU)}>
            Menu
          </NeonButton>
        </WinnerContent>
      </WinnerScreen>
    );
  }
  const { playerId, col } = winnerData;
  return (
    <WinnerScreen>
      <WinnerContent>
        <h1 style={{ color: toHTMLHex(col) }}>Player {playerId + 1} wins!</h1>
        <NeonButton onClick={() => setGameState(GameState.MAIN_MENU)}>
          Menu
        </NeonButton>
      </WinnerContent>
    </WinnerScreen>
  );
};

export default WinrarScreen;
