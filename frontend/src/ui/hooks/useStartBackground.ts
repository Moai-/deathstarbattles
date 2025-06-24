import { useEffect } from 'react';
import { stopMainScene } from 'src/game';
import { gameBus, GameEvents } from 'src/util';
import { startGameWithConfig } from '../functions/gameManagement';

export const useStartBackground = (isActive: boolean) => {
  useEffect(() => {
    if (isActive) {
      startGameWithConfig({ justBots: true });
      gameBus.on(GameEvents.GAME_END, () => {
        stopMainScene().then(() => startGameWithConfig({ justBots: true }));
      });
    } else {
      gameBus.off(GameEvents.GAME_END);
    }

    return () => {
      gameBus.off(GameEvents.GAME_END);
    };
  }, [isActive]);
};
