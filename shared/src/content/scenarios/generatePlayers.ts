import { GameWorld } from 'shared/src/ecs/world';
import { PlayerSetup, PlayerInfo } from 'shared/src/types';
import { playerCols, rgb } from 'shared/src/utils';
import { createDeathStar } from 'shared/src/content/entities';

export const generatePlayers = (
  world: GameWorld,
  playerSetup: Array<PlayerSetup>,
  stationPerPlayer: number = 1
) => {
  const parsedPlayers: Array<PlayerInfo> = [];
  const allRandom = playerSetup.find((p) => p.difficulty === 6);
  const allDifficulties = world.random.between(1, 5);
  for (let i = 0; i < playerSetup.length; i++) {
    const { type, difficulty } = playerSetup[i];
    const playerIdx = i + 1;
    let parsedType = 0;
    if (type > 0) {
      if (allRandom) {
        parsedType = allDifficulties;
      } else if (difficulty === 7) {
        parsedType = world.random.between(1, 5);
      } else {
        parsedType = difficulty;
      }
    }
    const stationEids: Array<number> = [];
    for (let i = 0; i < stationPerPlayer; i++) {
      stationEids.push(createDeathStar(world, {x: 0, y: 0}, {
        colour: world.random.colour(rgb(100, 100, 100), rgb(100, 100, 100)),
        owner: playerIdx,
      }))

    }
    parsedPlayers.push({
      idx: playerIdx,
      type: parsedType,
      stationEids,
      isAlive: true,
    });

  }
  return parsedPlayers;
};

export const generateRandomBots = (world: GameWorld) => {
  // const numPlayers = 2
  const numPlayers = world.random.between(4, 12);
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
