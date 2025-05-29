import React, { useEffect, useState } from 'react';
import { FaExpand, FaSignOutAlt } from 'react-icons/fa';
import {
  ControlPanelContainer,
  ToggleButton,
  SliderContainer,
  FineButton,
  ValueLabel,
  NeonButton,
  MiniButton,
  ActionButtonGroup,
  ControlRow,
  SideButtonColumn,
  StyledSlider,
} from '../styled';
import { toggleFullscreen } from '../functions/toggleFullscreen';
import { gameBus, GameEvents } from 'src/util';
import { OtherActions } from 'shared/src/types';

const ControlPanel: React.FC = () => {
  const [angle, setAngle] = useState(90);
  const [power, setPower] = useState(50);
  const [collapsed, setCollapsed] = useState(false);
  const [isHyperspaceOn, setIsHyperspaceOn] = useState(false);

  useEffect(() => {
    gameBus.on(GameEvents.ANGLE_POWER_GAME, ({ angle, power }) => {
      setAngle(Math.trunc(angle));
      setPower(Math.trunc(power));
    });
    gameBus.on(GameEvents.OTHER_ACTION_GAME, (otherAction) => {
      if (otherAction === OtherActions.HYPERSPACE) {
        setIsHyperspaceOn(true);
      } else if (!otherAction) {
        setIsHyperspaceOn(false);
      }
    });
    return () => {
      gameBus.off(GameEvents.ANGLE_POWER_GAME);
      gameBus.off(GameEvents.OTHER_ACTION_GAME);
    };
  }, []);

  const adjustValue = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    delta: number,
    min: number,
    max: number,
  ) => {
    setter((prev) => Math.min(max, Math.max(min, prev + delta)));
    gameBus.emit(GameEvents.ANGLE_POWER_UI, { angle, power });
  };

  const emitAngle = (angle: number) => {
    setAngle(angle);
    gameBus.emit(GameEvents.ANGLE_POWER_UI, { angle, power });
  };

  const emitPower = (power: number) => {
    setPower(power);
    gameBus.emit(GameEvents.ANGLE_POWER_UI, { angle, power });
  };

  const endTurn = () => gameBus.emit(GameEvents.END_TURN);
  const toggleHyperspace = () => {
    if (isHyperspaceOn) {
      setIsHyperspaceOn(false);
      gameBus.emit(GameEvents.OTHER_ACTION_UI, OtherActions.NONE);
    } else {
      setIsHyperspaceOn(true);
      gameBus.emit(GameEvents.OTHER_ACTION_UI, OtherActions.HYPERSPACE);
    }
  };

  return (
    <ControlPanelContainer collapsed={collapsed}>
      {/* Side Buttons */}
      <SideButtonColumn>
        <MiniButton onClick={toggleFullscreen}>
          <FaExpand />
        </MiniButton>
        <MiniButton>
          <FaSignOutAlt />
        </MiniButton>
      </SideButtonColumn>

      {/* Toggle Button */}
      <ToggleButton onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '▶' : '◀'}
      </ToggleButton>

      {/* Sliders Row */}
      <ControlRow>
        <SliderContainer>
          <FineButton
            onClick={() => adjustValue(setAngle, -1, -180, 180)}
            disabled={isHyperspaceOn}
          >
            -
          </FineButton>
          <StyledSlider
            min={-180}
            max={180}
            value={Math.floor(angle)}
            onChange={(e) => emitAngle(Number(e.target.value))}
            disabled={isHyperspaceOn}
          />
          <FineButton
            onClick={() => adjustValue(setAngle, 1, -180, 180)}
            disabled={isHyperspaceOn}
          >
            +
          </FineButton>
          <ValueLabel>Angle: {angle}°</ValueLabel>
        </SliderContainer>
        <SliderContainer>
          <FineButton
            onClick={() => adjustValue(setPower, -1, 20, 100)}
            disabled={isHyperspaceOn}
          >
            -
          </FineButton>
          <StyledSlider
            min={20}
            max={100}
            value={Math.floor(power)}
            onChange={(e) => emitPower(Number(e.target.value))}
            disabled={isHyperspaceOn}
          />
          <FineButton
            onClick={() => adjustValue(setPower, 1, 20, 100)}
            disabled={isHyperspaceOn}
          >
            +
          </FineButton>
          <ValueLabel>Power: {power}%</ValueLabel>
        </SliderContainer>
      </ControlRow>

      {/* Action Buttons */}
      <ActionButtonGroup>
        <NeonButton onClick={endTurn}>End Turn</NeonButton>
        <NeonButton onClick={toggleHyperspace}>
          Hyperspace{isHyperspaceOn ? ' [On] ' : ' [Off]'}
        </NeonButton>
      </ActionButtonGroup>
    </ControlPanelContainer>
  );
};

export default ControlPanel;
