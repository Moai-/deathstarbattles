import { FaExpand } from 'react-icons/fa';
import { toggleFullscreen } from '../functions/toggleFullscreen';
import {
  OverlayContainer,
  Title,
  Subtitle,
  NeonButton,
  MiniButton,
} from '../styled';
import { TopRightButton } from '../styled/containers';
import instructions from '../content/instructions';
import { SubBlock } from '../styled/text';
import pkg from '../../../../package.json';
import { GameState, useGameState } from './context';
import {
  softDestroyGame,
  startGameWithConfig,
} from '../functions/gameManagement';

const Splash: React.FC = () => {
  const { setGameState } = useGameState();
  const stopScene = () => {
    softDestroyGame().then(() => {
      console.log('game destroyed');
    });
  };
  const startScene = () => {
    startGameWithConfig({ justBots: true });
  };
  return (
    <OverlayContainer>
      <TopRightButton>
        <MiniButton onClick={toggleFullscreen}>
          <FaExpand />
        </MiniButton>
      </TopRightButton>
      <Title>Death Star Battles</Title>
      <Subtitle>
        © 2001 Ian Bolland // © 2025 Sergei Gmyria // v.{pkg.version}
      </Subtitle>
      <SubBlock>{instructions}</SubBlock>
      <SubBlock>
        <a href="https://github.com/Moai-/deathstarbattles" target="_blank">
          Github Repo
        </a>
        {' | '}
        <a href="http://deathstarbattles.co.uk" target="_blank">
          Original Website
        </a>
      </SubBlock>
      <NeonButton onClick={() => setGameState(GameState.CONFIG_GAME)}>
        New game
      </NeonButton>
      <NeonButton onClick={stopScene}>Stop scene</NeonButton>
      <NeonButton onClick={startScene}>Start scene</NeonButton>
    </OverlayContainer>
  );
};

export default Splash;
