import { AppModes, GameConfig } from 'shared/src/types';

type GameAppModule = typeof import('src/game/app');

let appPromise: Promise<GameAppModule['App']> | null = null;

const loadApp = async () => {
  console.log('app load begin', Date.now())
  if (!appPromise) {
    appPromise = import('src/game/app').then((mod) => mod.App);
  }
  return appPromise;
};

export { AppModes };

export const DeferredApp = {
  async createGame() {
    const app = await loadApp();
    return app.createGame();
  },

  async destroyGame() {
    const app = await loadApp();
    return app.destroyGame();
  },

  async startMode(mode: AppModes, config?: GameConfig) {
    const app = await loadApp();
    return app.startMode(mode, config);
  },

  async stopMode(mode: AppModes) {
    const app = await loadApp();
    return app.stopMode(mode);
  },
};