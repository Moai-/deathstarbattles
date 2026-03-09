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
import { SubBlock } from '../styled/text';
import pkg from '../../../../package.json';
import { GameState, useGameState } from './context';
import { useSound } from '../hooks/useSound';
import { useState } from 'react';

const instructions = `
Take turns to fire at each other by adjusting the angle and the power using the sliders or the firing control. When you are happy with the angle and power, press the end turn button to let the next player go. All players' shots will then be fired. All shots are affected by the gravity of stars and planets. If things get sticky, the hyperspace button will transport you to a random location. The last surviving station wins. Watch bots go at it in fullscreen with the top-right button!
`

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
    <OverlayContainer style={{padding: '50px 0'}}>
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
      <div style={{display: 'flex', gap: '10px'}}>
        <NeonButton onClick={() => setGameState(GameState.CONFIG_GAME)}>
          New game
        </NeonButton>
        <NeonButton onClick={() => setGameState(GameState.EDITOR)}>
          Editor
        </NeonButton>
      </div>
    </OverlayContainer>
  );
};

export default Splash;
