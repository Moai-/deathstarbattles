import { NeonButton } from '../styled';
import { WinnerScreen } from '../styled/containers';

const WinrarScreen: React.FC<{
  col: number;
  playerNum: number;
  onMenu: () => void;
}> = ({ col, playerNum, onMenu }) => {
  console.log('winner is player %s of col %s', playerNum, col);
  return (
    <WinnerScreen>
      <h1 style={{ color: 'white' }}>Player {playerNum} wins!</h1>
      <NeonButton onClick={onMenu}>Menu</NeonButton>
    </WinnerScreen>
  );
};

export default WinrarScreen;
