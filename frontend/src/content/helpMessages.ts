export type HelpTargets =
  | 'stations'
  | 'playerType'
  | 'difficulty'
  | 'scenarioType'
  | 'objectCount'
  | 'diff-1'
  | 'diff-2'
  | 'diff-3'
  | 'diff-4'
  | 'diff-5';

type HelpMessages = {
  [key in HelpTargets]: string;
};

export const helpMessages: HelpMessages = {
  stations:
    'Choose how many stations each player controls (1-4). Maximum stations in one game is 12, so multiple stations per player will result in fewer total available players.',
  playerType:
    'Select Human or NPC player. Multiple human players makes this into local singleplayer, where human players take turns specifying their attacks.',
  difficulty: 'Set the NPC difficulty (1-5). Disabled for human players.',
  scenarioType: 'Select the scenario for the game.',
  objectCount: 'Choose how many objects will be in the scenario (8 or 16).',
  'diff-1':
    'Slightly higher chance to hit than a completely random shot. \n\n"What does this button do?"',
  'diff-2':
    'Knows how to aim at enemies.\n\n"I\'m glad I paid attention in battlestation class!"',
  'diff-3':
    'Will try to correct its aim after missing shots.\n\n"I know *exactly* what this button does!"',
  'diff-4': 'Knows how to aim pretty well.\n\n"Worlds no more."',
  'diff-5':
    'Good luck.\n\n"Now witness the firepower of this fully armed and operational battle station!"',
};
