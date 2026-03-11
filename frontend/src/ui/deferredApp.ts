import { AppModes, GameConfig } from 'shared/src/types';

type GameAppModule = typeof import('src/game/app');

let appPromise: Promise<GameAppModule['App']> | null = null;

const loadApp = async () => {
  if (!appPromise) {
    appPromise = (async () => {
      // Load in order: extras extends core and overwrites global.Phaser; core must run first.
      await import('phaser-core');
      await import('phaser-extras');

      const mod = await import('src/game/app');
      return mod.App;
    })();
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