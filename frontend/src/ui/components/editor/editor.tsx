import { useEffect } from "react";
import { GameState, useGameState } from "../context";
import { startEditor } from "../../functions/gameManagement";
import { gameBus, GameEvents } from "src/util";

export const EditorScreen = () => {
  const { setGameState } = useGameState();
  useEffect(() => {
    gameBus.on(GameEvents.ED_ENTITY_CLICKED, (entities) => {
      console.log('heard you clicked these entities', entities);
    })
    startEditor();

    return () => gameBus.off(GameEvents.ED_ENTITY_CLICKED);
  }, []);

  const addEntity = () => {
    console.log('emitted add entity');
    gameBus.emit(GameEvents.ED_ADD_ENTITY)
  }
  
  return (
    <div>
      <button onClick={() => setGameState(GameState.MAIN_MENU)}>back</button>
      <button onClick={addEntity}>add</button>
    </div>
  )
}