import { GameWorld } from 'shared/src/ecs/world';
import { SimMessage, SimMessageType, SimResult } from './types';
import { buffersOf, buildSnapshot } from './snapshot';
import { TurnInput } from 'shared/src/types';

export class SimManager {
  private worker: Worker | null = null;
  private isReady = false;

  async startWorker() {
    return new Promise<void>((resolve, reject) => {
      this.worker = new Worker(new URL('./sim.worker', import.meta.url), {
        type: 'module',
      });
      this.worker.onmessage = (evt: MessageEvent<SimMessage>) => {
        if (this.worker && evt.data.type === SimMessageType.ACTIVE) {
          this.isReady = true;
          this.worker.onerror = (evt) => this.handleError(evt);
          resolve();
        }
      };
      this.worker.onerror = (evt) => {
        console.log('Error starting sim worker:', evt);
        this.shutdownWorker();
        reject();
      };
    });
  }

  shutdownWorker() {
    if (this.worker) {
      this.worker.terminate();
    }
    this.worker = null;
    this.isReady = false;
  }

  async initializeWorker(eids: Array<number>, world: GameWorld) {
    return new Promise<void>((resolve, reject) => {
      if (!this.isReady || !this.worker) {
        return reject(
          `SimManager: worker ${!this.worker && 'does not exist'}${!this.isReady && !this.worker && ' and '}${!this.isReady && 'is not ready'}`,
        );
      }
      this.isReady = false;
      const snapshot = buildSnapshot(eids, world);
      this.worker.onmessage = (evt) => {
        const message = evt.data as SimMessage;
        if (message.type === SimMessageType.INITIALIZE_DONE) {
          this.isReady = true;
          resolve();
        }
      };
      this.worker.postMessage(
        { type: SimMessageType.INITIALIZE, snapshot },
        buffersOf(snapshot),
      );
    });
  }

  async runSimulation(turnInput: TurnInput) {
    return new Promise<SimResult>((resolve, reject) => {
      if (!this.isReady || !this.worker) {
        return reject(
          `SimManager: worker ${!this.worker && 'does not exist'}${!this.isReady && !this.worker && ' and '}${!this.isReady && 'is not ready'}`,
        );
      }
      this.isReady = false;
      this.worker.onmessage = (evt) => {
        const message = evt.data as SimMessage;
        if (message.type === SimMessageType.SIMULATE_DONE) {
          this.isReady = true;
          resolve(message.result!);
        }
      };
      this.worker.postMessage({ type: SimMessageType.SIMULATE, turnInput });
    });
  }

  private handleError(err: ErrorEvent) {
    console.log('Worker encountered an error');
    console.log(err);
  }
}
