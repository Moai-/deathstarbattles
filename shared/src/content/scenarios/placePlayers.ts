import { GameWorld } from "shared/src/ecs/world";
import { UnplacedGameObject, ObjectPlacement } from "shared/src/types";
import { getRadius, generateNonOverlappingPositions, setPosition } from "shared/src/utils";
import { playerClearance } from "./placement";

export const placePlayers = (world: GameWorld, stationEids: Array<number>) => {
  const playerObjects: Array<UnplacedGameObject> = stationEids
    .map((item) => ({ radius: getRadius(item), eid: item, placement: ObjectPlacement.ANYWHERE }));
  const placedPlayers = generateNonOverlappingPositions(world, playerObjects, playerClearance);
  placedPlayers.forEach((p) => setPosition(p.eid, p.x, p.y));
  return placedPlayers;
}