import { toHTMLHex } from '../functions/utils';
import { NeonButton } from '../styled';
import { WinnerScreen } from '../styled/containers';

const WinrarScreen: React.FC<{
  col: number;
  playerNum: number;
  onMenu: () => void;
}> = ({ col, playerNum, onMenu }) => {
  return (
    <WinnerScreen>
      <h1 style={{ color: toHTMLHex(col) }}>Player {playerNum + 1} wins!</h1>
      <NeonButton onClick={onMenu}>Menu</NeonButton>
    </WinnerScreen>
  );
};

export default WinrarScreen;
