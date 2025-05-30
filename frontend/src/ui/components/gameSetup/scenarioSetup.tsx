import React from 'react';
import { PlayersTable, SimpleSetup } from '../../styled/containers';
import { SectionTitle } from 'src/ui/styled/text';
import { AddPlayerButton } from 'src/ui/styled/controls';
import { ScenarioItemRow } from './scenarioItemRow';
import { useScenario } from './scenarioContext';

export const ScenarioSetup: React.FC = () => {
  const { items, addItem } = useScenario();
  return (
    <div>
      <SectionTitle>Scenario Setup</SectionTitle>
      <SimpleSetup>
        <label htmlFor="scenarioTypeDropdown">Scenario Type:</label>
        <select id="scenarioTypeDropdown" data-info="scenarioType">
          <option>Standard</option>
          <option>Random</option>
        </select>
        <label htmlFor="objectCountDropdown">Number of Objects:</label>
        <select id="objectCountDropdown" data-info="objectCount">
          <option>8</option>
          <option>16</option>
        </select>
        <div>
          <SectionTitle>Advanced Scenario Setup</SectionTitle>
          <AddPlayerButton onClick={addItem}>+ Add Item</AddPlayerButton>
          <PlayersTable>
            {items.map((item) => (
              <ScenarioItemRow key={item.id} item={item} />
            ))}
          </PlayersTable>
        </div>
      </SimpleSetup>
    </div>
  );
};
