export type AudioCategory = 'music' | 'effects';

type AudioManifestItem = {
  key: string;
  url: string;
  vol: number;
  cat: AudioCategory;
  rp: boolean;
};

type AudioManifest = {
  [key: string]: AudioManifestItem;
};

const assetUrl = (asset: string) => `/assets/${asset}.ogg`;

type AudioManifestItemConfig = Partial<AudioManifestItem>;
const defaultManifestItemConfig: AudioManifestItemConfig = {
  key: '',
  url: '',
  vol: 0.3,
  cat: 'effects',
  rp: false,
};

const makeManifestItem = (
  key: string,
  conf: AudioManifestItemConfig = defaultManifestItemConfig,
) =>
  ({
    key,
    url: assetUrl(key.toLowerCase()),
    vol: conf.vol || defaultManifestItemConfig.vol,
    rp: conf.rp || defaultManifestItemConfig.rp,
    cat: conf.cat || defaultManifestItemConfig.cat,
  }) as AudioManifestItem;

export const audioManifest: AudioManifest = {
  songLoop: makeManifestItem('songLoop', { rp: true, vol: 0.1, cat: 'music' }),
  genericHit: makeManifestItem('genericHit'),
  stationHit: makeManifestItem('stationHit'),
  laserShot: makeManifestItem('laserShot'),
  travelHum: makeManifestItem('travelHum', { rp: true }),
};
