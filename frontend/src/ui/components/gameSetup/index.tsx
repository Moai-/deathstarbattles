import React, { useState } from 'react';
import { HelpTargets, helpMessages } from 'src/content/helpMessages';
import {
  SetupScreenContainer,
  SetupContent,
  InfoBox,
} from 'src/ui/styled/containers';
import { SetupHeader } from 'src/ui/styled/text';
import { SetupProvider } from './context';
import { PlayerSetup } from './playerSetup';
import { ScenarioSetup } from './scenarioSetup';
import { ScenarioProvider } from './scenarioContext';
import { SetupControls } from './controls';

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

  return (
    <SetupScreenContainer
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <SetupHeader>Game Setup</SetupHeader>
      <SetupProvider>
        <ScenarioProvider>
          <SetupContent>
            <PlayerSetup />
            <ScenarioSetup />
          </SetupContent>

          <SetupControls />
        </ScenarioProvider>
      </SetupProvider>
      <InfoBox>{infoText}</InfoBox>
    </SetupScreenContainer>
  );
};
