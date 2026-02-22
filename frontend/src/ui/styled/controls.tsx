import { styled } from 'styled-components';

export const NeonButton = styled.button`
  padding: 12px 24px;
  font-size: 18px;
  color: #00ffff;
  background-color: transparent;
  border: 2px solid #00ffff;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
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

  &:disabled {
    opacity: 0.7;
  }
`;

export const FineButton = styled(NeonButton)`
  padding: 4px 8px;
  margin: 4px;
  font-size: 12px;
  text-shadow: none;
  box-shadow: none;
  border: 1px solid #00ffff;
`;

export const MiniButton = styled(NeonButton)`
  padding: 4px;
  font-size: 16px;
  width: 32px;
  height: 32px;
`;

export const ToggleButton = styled(NeonButton)`
  position: absolute;
  right: -30px;
  top: 55px;
  border-radius: 0 5px 5px 0;
  padding: 6px 8px;
`;

export const EndTurnButton = styled(NeonButton)`
  border-radius: 0 5px 5px 0;
  padding: 0;
  width: 25px;
  height: 25px;
`;

export const StyledSlider = styled.input.attrs<{vertical?: boolean}>({ type: 'range' })`
  -webkit-appearance: none;
  width: ${({vertical}) => vertical ? '8px' : ''};
  height: ${({vertical}) => vertical ? '' : '8px'};
  background: #00ffff;
  border-radius: 4px;
  outline: none;
  margin: 0 5px;
  transition: background 0.3s;
  flex: 1;
  ${({vertical}) => vertical ? 'writing-mode: vertical-lr; transform: rotate(180deg);' : ''}

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

  &:disabled {
    opacity: 0.7;
  }
`;

export const AddPlayerButton = styled(FineButton)`
  margin-top: 10px;
`;

export const RemovePlayerButton = styled(MiniButton)``;

const MobileControl = styled.div`
  position: absolute;
  width: 50px;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const MobileLeftControl = styled(MobileControl)`
  left: 0;
`

export const MobileRightControl = styled(MobileControl)`
  right: 0;
`

export const DesktopControl = styled.div`
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 0;
  display: flex;
`;

export const DesktopButton = styled(NeonButton)`
  padding: 0 10px;
`;

export const ControlSection = styled.div`
  flex: 0;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`;

export const ControlSectionDesktop = styled.div`
  flex: 0;
  display: flex;
  padding: 10px;
`

export const SliderSection = styled.div`
  flex: 1;
  display: flex;
`