import { FaImage, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { toggleFullscreen } from '../functions/toggleFullscreen';
import {
  OverlayContainer,
  Title,
  Subtitle,
  NeonButton,
  MiniButton,
} from '../styled';
import {
  MuteButton,
  TopLeftButton,
  TopRightButton,
} from '../styled/containers';
import instructions from '../../content/instructions';
import { SubBlock } from '../styled/text';
import pkg from '../../../../package.json';
import { GameState, useGameState } from './context';
import { useSound } from '../hooks/useSound';
import { useState } from 'react';

const Splash: React.FC = () => {
  const { setGameState } = useGameState();
  const { muted, setMute } = useSound();
  const [screensaverMode, setScreensaverMode] = useState(false);

  const VolumeIcon = muted ? FaVolumeMute : FaVolumeUp;
  const ScreensaverIcon = screensaverMode ? FiMenu : FaImage;

  const toggleMute = () => setMute(!muted);
  const toggleScreensaver = () => {
    const newMode = !screensaverMode;
    setScreensaverMode(newMode);
    toggleFullscreen(newMode);
  };

  if (screensaverMode) {
    return (
      <TopLeftButton>
        <MiniButton onClick={toggleScreensaver}>
          <ScreensaverIcon />
        </MiniButton>
      </TopLeftButton>
    );
  }

  return (
    <OverlayContainer>
      <TopRightButton>
        <MiniButton onClick={toggleScreensaver}>
          <ScreensaverIcon />
        </MiniButton>
      </TopRightButton>
      <MuteButton>
        <MiniButton onClick={toggleMute}>
          <VolumeIcon />
        </MiniButton>
      </MuteButton>
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
    </OverlayContainer>
  );
};

export default Splash;
