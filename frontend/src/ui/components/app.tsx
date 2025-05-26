import { createGame } from 'src/game';
import { gameBus, GameEvents } from 'src/util';

const App: React.FC = () => {
  const endTurn = () => gameBus.emit(GameEvents.END_TURN);
  return (
    <div>
      <button onClick={createGame}>Make game</button>
      <button onClick={endTurn}>End turn</button>
    </div>
  );
};

export default App;
