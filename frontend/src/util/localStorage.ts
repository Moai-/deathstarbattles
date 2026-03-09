import { SerializedScenario } from "shared/src/types";

export const SCENARIO_STORAGE_KEY_PREFIX = "dsb_scenario_";

export const checkKey = (key: string) => key.startsWith(SCENARIO_STORAGE_KEY_PREFIX);

export const makeKey = (name: string) => `${SCENARIO_STORAGE_KEY_PREFIX}${name}`;

export const ensureKey = (key: string) => checkKey(key) ? key : makeKey(key);

export const extractNameFromKey = (key: string) => key.slice(SCENARIO_STORAGE_KEY_PREFIX.length)

export const saveScenario = (scenario: SerializedScenario, name: string) => {

  const key = ensureKey(name);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(scenario));
  }
}

export const loadScenario = (name: string) => {
  const key = ensureKey(name);

  if (typeof localStorage === 'undefined') {
    return;
  }
  const raw = localStorage.getItem(key);
  if (!raw) {
    return;
  }

  let scenario: SerializedScenario;
  try {
    scenario = JSON.parse(raw);
  } catch {
    console.log(`loadScenario: failed to parse loaded scenario "${name}":`)
    console.log(raw);
    return;
  }
  
  return scenario;
}

export const listScenarios = () => {
  if (typeof localStorage === 'undefined') {
    return [];
  }
  return Object.keys(localStorage)
    .filter(checkKey)
    .map(extractNameFromKey)
}