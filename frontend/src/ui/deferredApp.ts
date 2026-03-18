import { AppModes, GameConfig } from 'shared/src/types';

type GameAppModule = typeof import('src/game/app');

export { AppModes }

class DeferredAppClass {
  private appPromise: Promise<GameAppModule['App']> | null = null;
  private loading = true;
  private loadCallback = () => {};

  private async loadApp() {
    if (this.loading) {
    }
    if (!this.appPromise) {
      this.appPromise = (async () => {
        // Load in order: extras extends core and overwrites global.Phaser; core must run first.
        await import('phaser-core');
        await import('phaser-extras');
  
        const mod = await import('src/game/app');
        if (this.loading) {
          this.loadCallback();
          this.loadCallback = () => {};
        }
        this.loading = false;
        
        return mod.App;
      })();
    }
    return this.appPromise;
  }

  setLoadCallback(cb: () => void) {
    this.loadCallback = cb;
  }

  async createGame() {
    const app = await this.loadApp();
    return app.createGame();
  }

  async destroyGame() {
    const app = await this.loadApp();
    return app.destroyGame();
  }

  async startMode(mode: AppModes, config?: GameConfig) {
    const app = await this.loadApp();
    return app.startMode(mode, config);
  }

  async stopMode(mode: AppModes) {
    const app = await this.loadApp();
    return app.stopMode(mode);
  }
}

export const DeferredApp = new DeferredAppClass();