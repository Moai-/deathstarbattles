import { ScenarioItemRule, ObjectTypes } from 'shared/src/types';
import { scenarioItems } from './objectManifest';

type GenParams = Partial<ScenarioItemRule>;
export const generateObject = (type: ObjectTypes) => {
  const generator = (params: GenParams = {}) =>
    ({
      type,
      min: params.min || params.n || 0,
      n: params.n,
      max:
        params.max || scenarioItems.find((o) => o.key === type)?.maxAmount || 1,
      p: params.p || 1,
    }) as ScenarioItemRule;
  return generator;
};
