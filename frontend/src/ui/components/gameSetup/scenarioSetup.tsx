import React from 'react';
import { PlayersTable, SimpleSetup } from '../../styled/containers';
import { SectionTitle } from 'src/ui/styled/text';
import { AddPlayerButton } from 'src/ui/styled/controls';
import { ScenarioItemRow } from './scenarioItemRow';
import { useScenario } from './scenarioContext';
import { ObjectAmounts } from 'src/ui/types';
import { getScenarioTypes } from 'src/content/scenarios';

export const ScenarioSetup: React.FC = () => {
  const { items, addItem, amount, setAmount, scenario, setScenario } =
    useScenario();
  const not = false;
  return (
    <div>
      <SectionTitle>Scenario Setup</SectionTitle>
      <SimpleSetup>
        <label htmlFor="scenarioTypeDropdown">Scenario Type:</label>
        <select
          id="scenarioTypeDropdown"
          data-info="scenarioType"
          value={scenario}
          onChange={(evt) => setScenario(parseInt(evt.target.value))}
        >
          {getScenarioTypes().map((t, idx) => (
            <option value={idx} key={t.name}>
              {t.name}
            </option>
          ))}
        </select>
        <label htmlFor="objectCountDropdown">Number of Objects:</label>
        <select
          id="objectCountDropdown"
          data-info="objectCount"
          value={amount}
          onChange={(evt) => setAmount(parseInt(evt.target.value))}
        >
          <option value={ObjectAmounts.RAN_8}>Random (up to 8)</option>
          <option value={ObjectAmounts.RAN_16}>Random (up to 16)</option>
          <option value={ObjectAmounts.RAN_24}>Random (up to 24)</option>
        </select>
        {not && (
          <div>
            <SectionTitle>Advanced Scenario Setup</SectionTitle>
            <AddPlayerButton onClick={addItem}>+ Add Item</AddPlayerButton>
            <PlayersTable>
              {items.map((item) => (
                <ScenarioItemRow key={item.id} item={item} />
              ))}
            </PlayersTable>
          </div>
        )}
      </SimpleSetup>
    </div>
  );
};
