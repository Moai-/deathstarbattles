import React, { useMemo, useState } from 'react';
import { DropdownGroup, SetupScreenContainer, SimpleSetup, TopLeftButton } from 'src/ui/styled/containers';
import { SetupHeader } from 'src/ui/styled/text';
import styled from 'styled-components';
import { MiniButton, NeonButton } from '../styled';
import { PlayerSetup } from 'shared/src/types';
import { GameState, useGameState } from './context';
import { playerCols } from 'shared/src/utils';
import { FaSignOutAlt } from 'react-icons/fa';
import { getScenarioTypes } from 'shared/src/content/scenarios/scenarioManifest';
import { createWorldRandomApi } from 'shared/src/ecs/world';
import { listScenarios, loadScenario, makeKey } from 'src/util';

type SetupTab = 'generated' | 'saved';

export const DropdownRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  flex: 1;
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


const stationCountOptions = [1, 2, 3, 4];

const TabBar = styled.div`
  display: flex;
  width: 100%;
  gap: 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #00ffff40;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  background: ${(p) => (p.$active ? '#00ffff22' : 'transparent')};
  color: #00ffff;
  border: 1px solid ${(p) => (p.$active ? '#00ffff' : 'transparent')};
  border-bottom: ${(p) => (p.$active ? '1px solid transparent' : 'none')};
  margin-bottom: -1px;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  outline: none;
  &:hover {
    background: #00ffff18;
  }
`;

export const SetupScreen: React.FC = () => {
  const { setGameState } = useGameState();

  const [activeTab, setActiveTab] = useState<SetupTab>('generated');
  const [botCount, setBotCount] = useState('7');
  const [difficulty, setDifficulty] = useState('3');
  const [objectCount, setObjectCount] = useState('10');
  const [stationSize, setStationSize] = useState('2');
  const [stationCount, setStationCount] = useState('1');
  const [generatedScenario, setGeneratedScenario] = useState('0');
  const [savedScenario, setSavedScenario] = useState('');

  const types = getScenarioTypes({ random: createWorldRandomApi(Math.random) });
  const savedScenarioKeys = useMemo(() => listScenarios(), []);

  const generatedScenarioOptions = useMemo(
    () => types.map(({ name }, idx) => ({ value: String(idx), label: name })),
    [types]
  );
  const savedScenarioOptions = useMemo(
    () =>
      savedScenarioKeys.map((name) => ({
        value: makeKey(name),
        label: name,
      })),
    [savedScenarioKeys]
  );

  // Default saved scenario selection when switching to saved tab
  const effectiveSavedScenario =
    savedScenarioOptions.length > 0 && !savedScenarioOptions.some((o) => o.value === savedScenario)
      ? savedScenarioOptions[0].value
      : savedScenario;

  const start = () => {
    const players: Array<PlayerSetup> = [];
    const maxBots = parseInt(botCount, 10);
    const diff = parseInt(difficulty, 10);
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
    if (activeTab === 'saved') {
      const scenarioKey = effectiveSavedScenario;
      if (!scenarioKey) return;
      setGameState(GameState.INGAME, {
        justBots: false,
        players,
        stationSize: size,
        stationPerPlayer: Number(stationCount),
        savedScenario: loadScenario(scenarioKey),
      });
    } else {
      const [amountRaw, isMaxRaw] = objectCount.split('|');
      const amount = parseInt(amountRaw, 10);
      const isMax = isMaxRaw === 'true';
      const scenarioIdx = parseInt(generatedScenario, 10);
      const scenarioSetup = types[scenarioIdx];
      setGameState(GameState.INGAME, {
        justBots: false,
        players,
        maxItems: isMax ? amount : undefined,
        numItems: !isMax ? amount : undefined,
        background: scenarioSetup.background,
        itemRules: scenarioSetup.items,
        stationSize: size,
        stationPerPlayer: Number(stationCount),
      });
    }
  };

  const canStartSaved = activeTab !== 'saved' || savedScenarioOptions.length > 0;

  return (
    <SetupScreenContainer>
      <TopLeftButton>
        <MiniButton onClick={() => setGameState(GameState.MAIN_MENU)}>
          <FaSignOutAlt />
        </MiniButton>
      </TopLeftButton>
      <SetupHeader>Game Setup</SetupHeader>
      <TabBar>
        <Tab $active={activeTab === 'generated'} onClick={() => setActiveTab('generated')}>
          Generated scenarios
        </Tab>
        <Tab $active={activeTab === 'saved'} onClick={() => setActiveTab('saved')}>
          Saved scenarios
        </Tab>
      </TabBar>
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

        {activeTab === 'generated' ? (
          <DropdownGroup>
            <DropdownRow>
              <StyledLabel htmlFor="scenario">Scenario</StyledLabel>
              <StyledSelect
                id="scenario"
                value={generatedScenario}
                onChange={(e) => setGeneratedScenario(e.target.value)}
              >
                {generatedScenarioOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
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
        ) : (
          
            <DropdownGroup>
              <DropdownRow>
                <StyledLabel htmlFor="savedScenario">Scenario</StyledLabel>
                <StyledSelect
                  id="savedScenario"
                  value={effectiveSavedScenario}
                  onChange={(e) => setSavedScenario(e.target.value)}
                >
                  {savedScenarioOptions.length === 0 ? (
                    <option value="">No saved scenarios</option>
                  ) : (
                    savedScenarioOptions.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))
                  )}
                </StyledSelect>
              </DropdownRow>

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
        
        )}

        {activeTab === 'generated' ? (
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
            <DropdownRow>
              <StyledLabel htmlFor="stationCount">Station Count</StyledLabel>
              <StyledSelect
                id="stationCount"
                value={stationCount}
                onChange={(e) => setStationCount(e.target.value)}
              >
                {stationCountOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </StyledSelect>
            </DropdownRow>
          </DropdownGroup>
        ) : (
          <DropdownGroup>
            <DropdownRow>
              <StyledLabel htmlFor="stationCount">Station Count</StyledLabel>
              <StyledSelect
                id="stationCount"
                value={stationCount}
                onChange={(e) => setStationCount(e.target.value)}
              >
                {stationCountOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </StyledSelect>
            </DropdownRow>
          </DropdownGroup>
        )}

        
      </SimpleSetup>
      <NeonButton
        style={{ marginTop: '30px' }}
        onClick={start}
        disabled={activeTab === 'saved' && !canStartSaved}
      >
        Start Game
      </NeonButton>
    </SetupScreenContainer>
  );
};
