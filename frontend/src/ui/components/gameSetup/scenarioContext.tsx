import React, { createContext, useContext, useState } from 'react';
import { scenarioItems } from 'src/ui/content/scenarioSetup';
import { ObjectAmounts, ScenarioItem } from 'src/ui/types';

interface ScenarioContextProps {
  items: ScenarioItem[];
  amount: ObjectAmounts;
  scenario: number;
  setAmount: (amt: ObjectAmounts) => void;
  setScenario: (scn: number) => void;
  addItem: () => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, field: string, value: number) => void;
}

const ScenarioContext = createContext<ScenarioContextProps | undefined>(
  undefined,
);

export const ScenarioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<ScenarioItem[]>([]);
  const [amount, setAmount] = useState<ObjectAmounts>(ObjectAmounts.RAN_8);
  const [scenario, setScenario] = useState(0);

  const addItem = () => {
    // Find first available item type not already in use
    const available = scenarioItems.find(
      (item) => !items.some((i) => i.type === item.key),
    );
    if (!available) {
      return;
    }
    const nextId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([...items, { id: nextId, type: available.key, amount: 1 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  return (
    <ScenarioContext.Provider
      value={{
        amount,
        setAmount,
        items,
        addItem,
        removeItem,
        updateItem,
        scenario,
        setScenario,
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenario = () => {
  const context = useContext(ScenarioContext);
  if (!context)
    throw new Error('useScenario must be used within ScenarioProvider');
  return context;
};
