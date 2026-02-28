import { GameWorld } from 'shared/src/ecs/world';
import { PlayerSetup, PlayerInfo } from 'shared/src/types';
import { playerCols } from 'shared/src/utils';
import { createDeathStar } from 'src/entities/deathStar';

export const generatePlayers = (
  world: GameWorld,
  playerSetup: Array<PlayerSetup>,
) => {
  const parsedPlayers: Array<PlayerInfo> = [];
  const allRandom = playerSetup.find((p) => p.difficulty === 6);
  const allDifficulties = Phaser.Math.Between(1, 5);
  for (let i = 0; i < playerSetup.length; i++) {
    const { type, difficulty, col } = playerSetup[i];
    let parsedType = 0;
    if (type > 0) {
      if (allRandom) {
        parsedType = allDifficulties;
      } else if (difficulty === 7) {
        parsedType = Phaser.Math.Between(1, 5);
      } else {
        parsedType = difficulty;
      }
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
  // const numPlayers = 2
  const numPlayers = Phaser.Math.Between(4, 12);
  const rawPlayers: Array<PlayerSetup> = [];
  for (let i = 0; i < numPlayers; i++) {
    rawPlayers.push({
      id: i,
      type: 1,
      col: playerCols[i],
      difficulty: 5,
      // difficulty: Phaser.Math.Between(1, 5),
    });
  }
  return generatePlayers(world, rawPlayers);
};
