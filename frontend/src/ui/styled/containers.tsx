import styled from 'styled-components';

export const OverlayContainer = styled.div`
  position: fixed;
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px; /* Optional: rounded edges */
  z-index: 100; /* Ensure it overlays everything else */
`;

interface ControlPanelProps {
  collapsed: boolean;
}

export const ControlPanelContainer = styled(
  OverlayContainer,
)<ControlPanelProps>`
  width: 500px;
  height: 150px; /* Increased height to accommodate the new layout */
  bottom: 10px;
  left: ${({ collapsed }) => (collapsed ? '-510px' : '10px')};
  top: auto;
  transform: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 10px;
  border-radius: 10px;
  transition: left 0.3s ease;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 100;
`;

export const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const ActionButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 30px;
`;

export const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 5px;
`;

export const SideButtonColumn = styled.div`
  position: absolute;
  left: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TopRightButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const WinnerScreen = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  size: 14px;
`;
