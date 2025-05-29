import { useEffect } from 'react';
import { destroyGame } from 'src/game';
import { gameBus, GameEvents } from 'src/util';
import { startGameWithConfig } from '../functions/gameManagement';

export const useStartBackground = (isActive: boolean) => {
  useEffect(() => {
    if (isActive) {
      startGameWithConfig({ justBots: true });
      gameBus.on(GameEvents.GAME_END, () => {
        destroyGame();
        setTimeout(() => {
          if (isActive) {
            startGameWithConfig({ justBots: true });
          }
        }, 1000);
      });
      return () => destroyGame();
    } else {
      gameBus.off(GameEvents.GAME_END);
    }
  }, [isActive]);
};
