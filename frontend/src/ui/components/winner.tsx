import { toHTMLHex } from '../functions/utils';
import { NeonButton } from '../styled';
import { WinnerContent, WinnerScreen } from '../styled/containers';
import { GameState, useGameState } from './context';

export const WinnerPage: React.FC = () => {
  const { setGameState, winnerData } = useGameState();

  const renderWinnerInfo = () => {
    if (!winnerData) {
      return (<h1 style={{ color: 'white' }}>Nobody won! Total annihilation!</h1>)
    }
    const { playerId, col } = winnerData;
    return (<h1 style={{ color: toHTMLHex(col) }}>Player {playerId} wins!</h1>)
  }

  return (
    <WinnerScreen>
      <WinnerContent>
        {renderWinnerInfo()}
        <div style={{display: 'flex', gap: '10px'}}>
          <NeonButton onClick={() => setGameState(GameState.MAIN_MENU)}>
            Menu
          </NeonButton>
          <NeonButton onClick={() => setGameState(GameState.INGAME)}>
            Play again
          </NeonButton>
          <NeonButton onClick={() => setGameState(GameState.CONFIG_GAME)}>
            Change settings
          </NeonButton>
        </div>
      </WinnerContent>
    </WinnerScreen>
  );
};
