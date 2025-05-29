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

const Splash: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <OverlayContainer>
      <TopRightButton>
        <MiniButton onClick={toggleFullscreen}>
          <FaExpand />
        </MiniButton>
      </TopRightButton>
      <Title>Death Star Battles</Title>
      <Subtitle>
        © 2001 Ian Bolland // © 2025 Sergei Gmyria // v.0.5.0
      </Subtitle>
      <SubBlock>{instructions}</SubBlock>
      <SubBlock>
        <a href="https://github.com/Moai-/deathstarbattles" target="_blank">
          Github Repo
        </a>{' '}
        |{' '}
        <a href="deathstarbattles.co.uk" target="_blank">
          Original Website
        </a>
      </SubBlock>
      <NeonButton onClick={onStart}>Start Game</NeonButton>
    </OverlayContainer>
  );
};

export default Splash;
