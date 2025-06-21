import React, { createContext, useContext, useState } from 'react';
import playerCols from 'src/game/playerCols';
import { PlayerSetup } from 'shared/src/types';

interface SetupContextProps {
  players: PlayerSetup[];
  colMap: { [color: number]: number };
  addPlayer: () => void;
  removePlayer: (id: number) => void;
  updatePlayer: (id: number, field: string, value: number) => void;
}

const SetupContext = createContext<SetupContextProps | undefined>(undefined);

export const SetupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [players, setPlayers] = useState<PlayerSetup[]>([
    { id: 1, type: 0, col: playerCols[0], difficulty: 1 },
  ]);
  const [colMap, setColMap] = useState({ [playerCols[0]]: 1 });

  const findFirstAvailableColor = () => {
    for (const col of playerCols) {
      if (!colMap[col]) return col;
    }
    return null;
  };

  const addPlayer = () => {
    if (players.length >= 12) return;
    const col = findFirstAvailableColor();
    if (!col) {
      alert('All colors are used!');
      return;
    }
    const nextId = Math.max(...players.map((p) => p.id)) + 1;
    setPlayers([...players, { id: nextId, type: 1, col, difficulty: 1 }]);
    setColMap((prev) => ({ ...prev, [col]: nextId }));
  };

  const removePlayer = (id: number) => {
    const player = players.find((p) => p.id === id);
    if (!player) return;
    setPlayers(players.filter((p) => p.id !== id));
    setColMap((prev) => {
      const updated = { ...prev };
      delete updated[player.col];
      return updated;
    });
  };

  const updatePlayer = (id: number, field: string, value: number) => {
    setPlayers(
      players.map((p) => {
        if (p.id !== id) return p;
        if (field === 'color') {
          if (colMap[value] && colMap[value] !== id) return p;
          setColMap((prev) => {
            const updated = { ...prev };
            delete updated[p.col];
            updated[value] = id;
            return updated;
          });
          return { ...p, color: value };
        }
        return { ...p, [field]: value };
      }),
    );
  };

  return (
    <SetupContext.Provider
      value={{ players, colMap, addPlayer, removePlayer, updatePlayer }}
    >
      {children}
    </SetupContext.Provider>
  );
};

export const useSetup = () => {
  const context = useContext(SetupContext);
  if (!context) throw new Error('useSetup must be used within SetupProvider');
  return context;
};
