import { styled } from 'styled-components';

export const NeonButton = styled.button`
  padding: 12px 24px;
  font-size: 18px;
  color: #00ffff;
  background-color: transparent;
  border: 2px solid #00ffff;
  border-radius: 8px;
  cursor: pointer;
  text-shadow:
    0 0 5px #00ffff,
    0 0 10px #00ffff;
  box-shadow:
    0 0 5px #00ffff,
    0 0 20px #00ffff;
  transition:
    background-color 0.3s,
    color 0.3s;

  &:hover {
    background-color: #00ffff;
    color: #000000;
  }
`;

export const FineButton = styled(NeonButton)`
  padding: 4px 8px;
  font-size: 12px;
  text-shadow: none;
  box-shadow: none;
  border: 1px solid #00ffff;
`;

export const MiniButton = styled(NeonButton)`
  padding: 4px;
  font-size: 16px;
  width: 40px;
  height: 40px;
`;

export const ToggleButton = styled(NeonButton)`
  position: absolute;
  right: -30px;
  top: 55px;
  border-radius: 0 5px 5px 0;
  padding: 6px 8px;
`;

export const StyledSlider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: #00ffff;
  border-radius: 4px;
  outline: none;
  margin: 0 5px;
  transition: background 0.3s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #00ffff;
    border: 2px solid #000;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px #00ffff;
    transition: background 0.3s;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #00ffff;
    border: 2px solid #000;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px #00ffff;
    transition: background 0.3s;
  }
`;

export const AddPlayerButton = styled(FineButton)`
  margin-top: 10px;
`;

export const RemovePlayerButton = styled(MiniButton)``;
