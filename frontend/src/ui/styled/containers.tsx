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

export const SetupScreenContainer = styled(OverlayContainer)`
  width: 800px;
  height: 912px;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
`;

export const SetupContent = styled.div`
  padding-top: 60px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex: 1;
  width: 100%;
`;

export const PlayerSetupSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ScenarioSetupSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const StationsPerPlayerRow = styled(ControlRow)`
  margin-bottom: 10px;
`;

export const PlayersTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

export const PlayerRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const SimpleSetup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AdvancedSetup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export const InfoBox = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 200px;
  height: 150px;
  background-color: rgba(50, 50, 50, 0.9);
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  overflow-y: auto;
`;
