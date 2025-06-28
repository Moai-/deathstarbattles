import React from 'react';
import { useScenario } from '././scenarioContext';
import { RemovePlayerButton } from 'src/ui/styled/controls';
import { scenarioItems } from 'src/content/scenarios';

export const ScenarioItemRow: React.FC<{
  item: { id: number; type: number; amount: number };
}> = ({ item }) => {
  const { items, updateItem, removeItem } = useScenario();

  // Available types not already chosen (plus the current one)
  const availableTypes = scenarioItems.filter(
    (si) => !items.some((i) => i.type === si.key) || si.key === item.type,
  );

  const currentMax =
    scenarioItems.find((si) => si.key === item.type)?.maxAmount ?? 1;

  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
      <select
        style={{ width: 120 }}
        value={item.type}
        onChange={(e) => updateItem(item.id, 'type', parseInt(e.target.value))}
      >
        {availableTypes.map((si) => (
          <option key={si.key} value={si.key}>
            {si.label}
          </option>
        ))}
      </select>
      <select
        style={{ width: 60 }}
        value={item.amount}
        onChange={(e) =>
          updateItem(item.id, 'amount', parseInt(e.target.value))
        }
      >
        {Array.from({ length: currentMax }, (_, i) => i + 1).map((num) => (
          <option key={num}>{num}</option>
        ))}
      </select>
      <RemovePlayerButton onClick={() => removeItem(item.id)}>
        -
      </RemovePlayerButton>
    </div>
  );
};
