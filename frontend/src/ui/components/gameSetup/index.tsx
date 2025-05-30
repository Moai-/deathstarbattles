import React, { useState } from 'react';
import { HelpTargets, helpMessages } from 'src/ui/content/helpMessages';
import { NeonButton } from 'src/ui/styled';
import {
  SetupScreenContainer,
  SetupContent,
  InfoBox,
} from 'src/ui/styled/containers';
import { SetupHeader } from 'src/ui/styled/text';
import { SetupProvider } from './context';
import { PlayerSetup } from './playerSetup';
import { ScenarioSetup } from './scenarioSetup';

const emptyHelp = 'Hover over a control to see info';

export const SetupScreen: React.FC = () => {
  const [infoText, setInfoText] = useState(emptyHelp);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const infoKey = (e.target as HTMLDivElement).getAttribute(
      'data-info',
    ) as HelpTargets;
    if (infoKey && helpMessages[infoKey]) setInfoText(helpMessages[infoKey]);
  };

  const handleMouseOut = () => setInfoText(emptyHelp);

  const startGame = () => {
    console.log('Start game clicked!');
  };

  return (
    <SetupProvider>
      <SetupScreenContainer
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <SetupHeader>Game Setup</SetupHeader>
        <SetupContent>
          <PlayerSetup />
          <ScenarioSetup />
        </SetupContent>
        <InfoBox>{infoText}</InfoBox>
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <NeonButton onClick={startGame}>Start Game</NeonButton>
        </div>
      </SetupScreenContainer>
    </SetupProvider>
  );
};
