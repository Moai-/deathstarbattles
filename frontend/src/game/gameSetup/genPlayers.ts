import { GameWorld } from 'shared/src/ecs/world';
import { PlayerSetup, PlayerInfo } from 'shared/src/types';
import { createDeathStar } from 'src/entities/deathStar';
import playerCols from '../playerCols';

export const generatePlayers = (
  world: GameWorld,
  playerSetup: Array<PlayerSetup>,
) => {
  const parsedPlayers: Array<PlayerInfo> = [];
  for (let i = 0; i < playerSetup.length; i++) {
    const { type, difficulty, col } = playerSetup[i];
    let parsedType = 0;
    if (type > 0) {
      parsedType = difficulty;
    }
    parsedPlayers.push({
      type: parsedType,
      id: createDeathStar(world, 0, 0, col),
      isAlive: true,
    });
  }
  return parsedPlayers;
};

export const generateRandomBots = (world: GameWorld) => {
  const numPlayers = Phaser.Math.Between(4, 12);
  const rawPlayers: Array<PlayerSetup> = [];
  for (let i = 0; i < numPlayers; i++) {
    rawPlayers.push({
      id: i,
      type: 1,
      col: playerCols[i],
      difficulty: Phaser.Math.Between(1, 5),
    });
  }
  return generatePlayers(world, rawPlayers);
};
