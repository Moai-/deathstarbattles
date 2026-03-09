import { Backgrounds, ObjectPlacement, ScenarioItemRule, ScenarioType } from 'shared/src/types';
import {
  anomaly,
  asteroid,
  bigWormhole,
  blackHole,
  jetBlackHole,
  jovian,
  neutronStar,
  planet,
  redGiant,
  scenarioItems,
  star,
  supergiant,
  whiteDwarf,
  whiteHole,
  wormhole,
} from './objectManifest';
import { GameWorld } from 'shared/src/ecs/world';

export { scenarioItems };

const none = Backgrounds.NONE;
const neb = Backgrounds.NEBULAR;
const deep = Backgrounds.DEEPSPACE;
const bgst = Backgrounds.STARS;

const rare = { p: 0.05 };


// prettier-ignore
export const getScenarioTypes = (world: GameWorld): Array<ScenarioType> => {
  const oneOf = (...items: Array<ScenarioItemRule>) => world.random.pickElement(items);
  const oneBg = (...args: Array<Backgrounds>) => world.random.pickElement(args);
  const regBg = () => oneBg(Backgrounds.DEEPSPACE, Backgrounds.NEBULAR, Backgrounds.STARS);


  const rareGoodies = () => oneOf(
    blackHole({ max: 2, ...rare }),
    wormhole({ min: 2, ...rare }),
    whiteHole({ max: 3, ...rare }),
    whiteDwarf({ max: 3, ...rare }),
  );

  const ganglies = () => oneOf(
    jetBlackHole({n: 1, p: 0.5}),
    neutronStar({n: 1, p: 0.3})
  );

  const systemStar = () => ({
    ...oneOf(star({max: 2, p: 0.5}), redGiant({max: 1})),
    plc: ObjectPlacement.CLOSE_TO_CENTER
  });
  return [
    //{ name: 'Test',               background: neb,                      items: [jetBlackHole({n:1})],  },
      { name: 'Lucky Dip',          background: regBg(),                  items: [systemStar(), asteroid(), planet(), rareGoodies()] },
      { name: 'Planetary',          background: oneBg(neb, bgst),         items: [planet({min: 1}), asteroid({p: 0.3}), rareGoodies()] },
      { name: 'Asteroids',          background: regBg(),                  items: [planet({p: 0.1}), asteroid(), rareGoodies()] },
      { name: 'Star System',        background: regBg(),                  items: [star({n: 1}), planet({max: 2}), asteroid(), rareGoodies()] },
      { name: 'Binary System',      background: regBg(),                  items: [star({n: 2}), planet(), asteroid(), rareGoodies()] },
      { name: 'Jovian',             background: neb,                      items: [jovian({n: 1}), asteroid(), rareGoodies()] },
      { name: 'Supergiant',         background: oneBg(deep, neb),         items: [supergiant({n: 1}), planet({p: 0.5}), asteroid()] },
      { name: 'Super Binary',       background: oneBg(deep, neb),         items: [supergiant({n: 1}), oneOf(supergiant({n: 1}), bigWormhole({n: 1})), asteroid()] },
      { name: 'Uneven Binary',      background: regBg(),                  items: [supergiant({n: 1}), oneOf(star({n: 1}), blackHole({n: 1})), asteroid()] },
      { name: 'Red Giant',          background: neb,                      items: [redGiant({n: 1}), asteroid(), rareGoodies()] },
      { name: 'Star Cluster',       background: oneBg(deep, neb),         items: [star({n: 3}), whiteDwarf(rare)] },
      { name: 'Mixture',            background: regBg(),                  items: [star(), planet(), asteroid(), rareGoodies()] },
      { name: 'White Dwarf',        background: deep,                     items: [whiteDwarf({n: 1}), asteroid(), oneOf(planet({max: 1, p: 0.3}), jovian(rare))] },
      { name: 'White Dwarfs',       background: deep,                     items: [whiteDwarf({min: 3}), whiteHole(rare)] },
      { name: 'Wormhole',           background: bgst,                     items: [wormhole({min: 2, max: 3}), planet(rare), asteroid()] },
      { name: 'Wormholes',          background: neb,                      items: [wormhole({min: 2, max: 20})] },
      { name: 'Big Wormhole',       background: oneBg(deep, neb),         items: [bigWormhole({min: 1, max: 2}), asteroid(), rareGoodies()] },
      { name: 'Black Hole',         background: oneBg(deep, bgst),        items: [blackHole({min: 1}), asteroid(), planet(rare), jovian(rare)] },
      { name: 'Black holes',        background: oneBg(deep, bgst),        items: [blackHole({min: 2}), whiteHole({max: 3, ...rare}), anomaly({max: 3, ...rare})] },
      { name: 'White Hole',         background: regBg(),                  items: [whiteHole({n: 1}), asteroid(), planet(rare), jovian(rare)] },
      { name: 'White Holes',        background: regBg(),                  items: [whiteHole({min: 1})] },
      { name: 'Stellar Graveyard',  background: oneBg(deep, bgst),        items: [blackHole({min: 1, max: 5}), whiteHole({min: 1, max: 5}), whiteDwarf({p: 0.3}), wormhole({max: 6, ...rare}), ganglies()]},
      { name: 'Hyperspace Classic', background: none,                     items: [anomaly(), blackHole({ max: 2, ...rare }), wormhole({ min: 2, max: 6, ...rare })] },
      // { name: 'Hyperspace Redux',   background: shard,                    items: [tunnelLocus(), anomaly()],  },
    ];
}
