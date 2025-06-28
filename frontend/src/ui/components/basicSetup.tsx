import React, { useState } from 'react';
import { SetupScreenContainer, SimpleSetup } from 'src/ui/styled/containers';
import { SetupHeader } from 'src/ui/styled/text';
import styled from 'styled-components';
import { NeonButton } from '../styled';
import { startGameWithConfig } from '../functions/gameManagement';
import { PlayerSetup } from 'shared/src/types';
import { GameState, useGameState } from './context';
import { playerCols } from 'shared/src/utils';
import { getScenarioTypes } from 'src/content/scenarios';

export const DropdownRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledLabel = styled.label`
  font-size: 14px;
  color: #00ffff;
`;

export const StyledSelect = styled.select`
  padding: 8px 12px;
  font-size: 16px;
  background-color: #111;
  color: #00ffff;
  border: 1px solid #00ffff;
  border-radius: 6px;
  outline: none;

  &:focus {
    box-shadow: 0 0 8px #00ffff;
  }
`;

export const SetupScreen: React.FC = () => {
  const [botCount, setBotCount] = useState('7');
  const [difficulty, setDifficulty] = useState('3');
  const [objectCount, setObjectCount] = useState('10');
  const [scenario, setScenario] = useState('0');
  const { setGameState } = useGameState();
  const types = getScenarioTypes();

  const start = () => {
    const players: Array<PlayerSetup> = [];
    const maxBots = parseInt(botCount, 10);
    const diff = parseInt(difficulty, 10);
    const maxItems = parseInt(objectCount, 10);
    const scenarioIdx = parseInt(scenario, 10);
    players.push({ id: 0, type: 0, difficulty: 0, col: playerCols[0] });
    for (let i = 0; i < maxBots; i++) {
      players.push({
        id: 0,
        type: 1,
        difficulty: diff,
        col: playerCols[i + 1],
      });
    }
    startGameWithConfig({
      justBots: false,
      players,
      maxItems,
      itemRules: types[scenarioIdx].items,
    });
    setGameState(GameState.INGAME);
  };

  return (
    <SetupScreenContainer>
      <SetupHeader>Game Setup</SetupHeader>
      <SimpleSetup>
        <DropdownRow>
          <StyledLabel htmlFor="botCount">Number of Bots</StyledLabel>
          <StyledSelect
            id="botCount"
            value={botCount}
            onChange={(e) => setBotCount(e.target.value)}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </StyledSelect>
        </DropdownRow>

        <DropdownRow>
          <StyledLabel htmlFor="difficulty">Bot Difficulty</StyledLabel>
          <StyledSelect
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {['Trivial', 'Easy', 'Medium', 'Hard', 'Very Hard'].map((n, i) => (
              <option key={n} value={i - 0 + 1}>
                {n}
              </option>
            ))}
          </StyledSelect>
        </DropdownRow>

        <DropdownRow>
          <StyledLabel htmlFor="objectCount">Number of Objects</StyledLabel>
          <StyledSelect
            id="objectCount"
            value={objectCount}
            onChange={(e) => setObjectCount(e.target.value)}
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </StyledSelect>
        </DropdownRow>

        <DropdownRow>
          <StyledLabel htmlFor="scenario">Scenario</StyledLabel>
          <StyledSelect
            id="scenario"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          >
            {types.map(({ name }, idx) => (
              <option key={name} value={idx}>
                {name}
              </option>
            ))}
          </StyledSelect>
        </DropdownRow>
      </SimpleSetup>

      <NeonButton style={{ marginTop: '30px' }} onClick={start}>
        Start Game
      </NeonButton>
    </SetupScreenContainer>
  );
};
