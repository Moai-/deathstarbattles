import { Backgrounds } from 'shared/src/types';
import { BackgroundGenerator } from 'src/render/types';
import { generateBlank } from './blank';
import { generateStars } from './stars';
import { generateDeepSpace } from './deepspace';
import { generateNebular } from './nebular';

export const generatorMap: Record<Backgrounds, BackgroundGenerator> = {
  [Backgrounds.NONE]: generateBlank,
  [Backgrounds.STARS]: generateStars,
  [Backgrounds.DEEPSPACE]: generateDeepSpace,
  [Backgrounds.NEBULAR]: generateNebular,
}