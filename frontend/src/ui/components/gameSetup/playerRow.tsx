import React from 'react';
import { RemovePlayerButton } from '../../styled/controls';
import Select from 'react-select';
import { StylesConfig, SingleValue } from 'react-select';
import { useSetup } from './context';
import { PlayerSetup } from 'shared/src/types';
import {playerCols, colNames} from 'shared/src/utils';
import { toHTMLHex } from 'src/ui/functions/utils';

interface ColorOption {
  value: number;
  label: string;
  color: string;
  isDisabled?: boolean;
}

const customStyles: StylesConfig<ColorOption, false> = {
  control: (styles) => ({ ...styles, width: '160px' }),
  option: (styles, { isDisabled, isSelected }) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: isSelected ? '#333' : isDisabled ? '#555' : '#222',
    color: 'white',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
  }),
  singleValue: (styles) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
  }),
};

const formatOptionLabel = (option: ColorOption) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div
      style={{
        backgroundColor: option.color,
        width: '20px',
        height: '20px',
        marginRight: '10px',
        borderRadius: '3px',
      }}
    />
    {option.label}
  </div>
);

const buildColOptions = (
  colorMap: { [color: number]: number },
  playerId: number,
) =>
  playerCols.map((col, idx) => ({
    value: col,
    label: colNames[idx],
    color: toHTMLHex(col),
    isDisabled: colorMap[col] !== undefined && colorMap[col] !== playerId,
  }));

export const PlayerRow: React.FC<{ player: PlayerSetup }> = ({ player }) => {
  const { colMap, updatePlayer, removePlayer } = useSetup();
  const options = buildColOptions(colMap, player.id);

  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
      <select
        value={player.type}
        data-info={'playerType'}
        onChange={(e) =>
          updatePlayer(player.id, 'type', parseInt(e.target.value))
        }
      >
        <option value={0}>Human</option>
        <option value={1}>NPC</option>
      </select>
      <Select<ColorOption, false>
        value={
          options.find(
            (o) => o.value === player.col,
          ) as SingleValue<ColorOption>
        }
        onChange={(selected) =>
          selected && updatePlayer(player.id, 'col', selected.value)
        }
        options={options}
        isOptionDisabled={(opt) => opt.isDisabled ?? false}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
      />
      <select
        value={player.difficulty}
        data-info={'difficulty'}
        disabled={player.type !== 1}
        onChange={(e) =>
          updatePlayer(player.id, 'difficulty', parseInt(e.target.value))
        }
      >
        <option value={1}>Randbot</option>
        <option value={2}>Aimbot</option>
        <option value={3}>Cleverbot</option>
        <option value={4}>Superbot</option>
        <option value={5}>Megabot</option>
      </select>
      <RemovePlayerButton onClick={() => removePlayer(player.id)}>
        -
      </RemovePlayerButton>
    </div>
  );
};
