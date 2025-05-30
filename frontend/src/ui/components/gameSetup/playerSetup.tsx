import React from 'react';
import { StationsPerPlayerRow, PlayersTable } from '../../styled/containers';
import { AddPlayerButton } from '../../styled/controls';
import { useSetup } from './context';
import { PlayerRow } from './playerRow';
import { SectionTitle } from 'src/ui/styled/text';

export const PlayerSetup: React.FC = () => {
  const { players, addPlayer } = useSetup();
  return (
    <div>
      <SectionTitle>Player Setup</SectionTitle>
      <StationsPerPlayerRow>
        <label htmlFor="stationsDropdown">Stations per Player:</label>
        <select id="stationsDropdown" data-info="stations">
          {[1, 2, 3, 4].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </StationsPerPlayerRow>
      <AddPlayerButton onClick={addPlayer}>+ Add Player</AddPlayerButton>
      <PlayersTable>
        {players.map((player) => (
          <PlayerRow key={player.id} player={player} />
        ))}
      </PlayersTable>
    </div>
  );
};
