import React from 'react';
import { PlayerSetupRow } from '../../styled/containers';
import { useSetup } from './context';
import { SectionTitle } from 'src/ui/styled/text';

export const PlayerSetup: React.FC = () => {
  const { botDiff, numBots, setBots } = useSetup();
  return (
    <div>
      <SectionTitle>Player Setup</SectionTitle>
      {/* <PlayerSetupRow>
        <label htmlFor="stationsDropdown">Stations per Player:</label>
        <select id="stationsDropdown" data-info="stations">
          {[1, 2, 3, 4].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </PlayerSetupRow> */}
      <PlayerSetupRow>
        <label htmlFor="numBotsDropdown">Number of bots:</label>
        <select
          id="numBotsDropdown"
          value={numBots}
          onChange={(evt) =>
            setBots({ numBots: parseInt(evt.target.value, 10) })
          }
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </PlayerSetupRow>
      <PlayerSetupRow>
        <label htmlFor="diffDropdown">Bot difficulty:</label>
        <select
          id="diffDropdown"
          value={botDiff}
          onChange={(evt) =>
            setBots({ numBots: parseInt(evt.target.value, 10) })
          }
        >
          {['Trivial', 'Easy', 'Medium', 'Hard', 'Very Hard'].map((n, i) => (
            <option key={n} value={i + 1}>
              {n}
            </option>
          ))}
        </select>
      </PlayerSetupRow>
      {/* <AddPlayerButton onClick={addPlayer}>+ Add Player</AddPlayerButton> */}
      {/* <PlayersTable>
        {players.map((player) => (
          <PlayerRow key={player.id} player={player} />
        ))}
      </PlayersTable> */}
    </div>
  );
};
