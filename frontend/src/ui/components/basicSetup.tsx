import React, { useState } from 'react';
import { DropdownGroup, SetupScreenContainer, SimpleSetup } from 'src/ui/styled/containers';
import { SetupHeader } from 'src/ui/styled/text';
import styled from 'styled-components';
import { NeonButton } from '../styled';
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

// eslint-disable-next-line prettier/prettier
const sizes = ['Tiny', 'Small', 'Large', 'That\'s no moon'];

const amounts: Array<{ label: string; amount: number; isMax: boolean }> = [
  { label: '5', amount: 5, isMax: false },
  { label: '10', amount: 10, isMax: false },
  { label: '15', amount: 15, isMax: false },
  { label: '20', amount: 20, isMax: false },
  { label: '25', amount: 25, isMax: false },
  { label: '30', amount: 30, isMax: false },
  { label: 'Up to 10', amount: 10, isMax: true },
  { label: 'Up to 20', amount: 20, isMax: true },
  { label: 'Up to 30', amount: 30, isMax: true },
];

export const SetupScreen: React.FC = () => {
  const [botCount, setBotCount] = useState('7');
  const [difficulty, setDifficulty] = useState('3');
  const [objectCount, setObjectCount] = useState('10');
  const [stationSize, setStationSize] = useState('2');
  const [scenario, setScenario] = useState('0');
  const { setGameState } = useGameState();
  const types = getScenarioTypes();

  const start = () => {
    const players: Array<PlayerSetup> = [];
    const maxBots = parseInt(botCount, 10);
    const diff = parseInt(difficulty, 10);
    const [amountRaw, isMaxRaw] = objectCount.split('|');
    const amount = parseInt(amountRaw, 10);
    const isMax = isMaxRaw === 'true';
    const scenarioIdx = parseInt(scenario, 10);
    const size = parseInt(stationSize);
    players.push({ id: 0, type: 0, difficulty: 0, col: playerCols[0] });
    for (let i = 0; i < maxBots; i++) {
      players.push({
        id: 0,
        type: 1,
        difficulty: diff,
        col: playerCols[i + 1],
      });
    }
    const scenarioSetup = types[scenarioIdx];
    setGameState(GameState.INGAME, {
      justBots: false,
      players,
      maxItems: isMax ? amount : undefined,
      numItems: !isMax ? amount : undefined,
      background: scenarioSetup.background,
      itemRules: scenarioSetup.items,
      stationSize: size,
    });
  };

  return (
    <SetupScreenContainer>
      <SetupHeader>Game Setup</SetupHeader>
      <SimpleSetup>
        <DropdownGroup>
          <DropdownRow>
            <StyledLabel htmlFor="botCount">Number of Bots</StyledLabel>
            <StyledSelect
              id="botCount"
              value={botCount}
              onChange={(e) => setBotCount(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
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
              {[
                'Failbot',
                'Aimbot',
                'Cleverbot',
                'Superbot',
                'Megabot',
                'All Random',
                'Per-Bot Random',
              ].map((n, i) => (
                <option key={n} value={i - 0 + 1}>
                  {n}
                </option>
              ))}
            </StyledSelect>
          </DropdownRow>
        </DropdownGroup>
        <DropdownGroup>
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
          <DropdownRow>
            <StyledLabel htmlFor="objectCount">Number of Objects</StyledLabel>
            <StyledSelect
              id="objectCount"
              value={objectCount}
              onChange={(e) => setObjectCount(e.target.value)}
            >
              {amounts.map(({ label, amount, isMax }) => (
                <option key={label} value={`${amount}|${isMax}`}>
                  {label}
                </option>
              ))}
            </StyledSelect>
          </DropdownRow>
        </DropdownGroup>

        <DropdownGroup>
          <DropdownRow>
            <StyledLabel htmlFor="stationSize">Station Size</StyledLabel>
            <StyledSelect
              id="stationSize"
              value={stationSize}
              onChange={(e) => setStationSize(e.target.value)}
            >
              {sizes.map((n, i) => (
                <option key={n} value={i - 0 + 1}>
                  {n}
                </option>
              ))}
            </StyledSelect>
          </DropdownRow>
        </DropdownGroup>







      </SimpleSetup>

      <NeonButton style={{ marginTop: '30px' }} onClick={start}>
        Start Game
      </NeonButton>
    </SetupScreenContainer>
  );
};
