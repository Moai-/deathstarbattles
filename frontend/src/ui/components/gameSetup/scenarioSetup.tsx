import React from 'react';
import { SimpleSetup } from '../../styled/containers';
import { SectionTitle } from 'src/ui/styled/text';

export const ScenarioSetup: React.FC = () => (
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
    </SimpleSetup>
  </div>
);
