import { GameWorld } from 'shared/src/ecs/world';
import { SimMessage, SimMessageType } from './types';
import { buffersOf, buildSnapshot } from './snapshot';
import { SimShotResult, TurnInput } from 'shared/src/types';

export class SimManager {
  private worker: Worker | null = null;
  private isReady = false;

  async startWorker() {
    return new Promise<void>((resolve, reject) => {
      // console.time('start worker');
      this.worker = new Worker(new URL('./sim.worker', import.meta.url), {
        type: 'module',
      });
      this.worker.onmessage = (evt: MessageEvent<SimMessage>) => {
        if (this.worker && evt.data.type === SimMessageType.ACTIVE) {
          // console.timeEnd('start worker');

          this.isReady = true;
          this.worker.onerror = (evt) => this.handleError(evt);
          resolve();
        }
        // reject('Failed to start worker');
      };
      this.worker.onerror = (evt) => {
        console.log('Error starting sim worker:', evt);
        this.shutdownWorker();
        reject('Failed to start worker');
      };
    });
  }

  destroy() {
    this.shutdownWorker();
  }

  shutdownWorker() {
    if (this.worker) {
      this.worker.terminate();
    }
    this.worker = null;
    this.isReady = false;
  }

  async initializeWorker(eids: Array<number>, world: GameWorld) {
    // console.time('init worker');
    return new Promise<void>((resolve, reject) => {
      if (!this.isReady || !this.worker) {
        return reject('SimManager: worker does not exist or is not ready');
      }
      this.isReady = false;
      // console.time('worker: build snapshot');

      const snapshot = buildSnapshot(eids, world);
      // console.timeEnd('worker: build snapshot');

      this.worker.onmessage = (evt) => {
        const message = evt.data as SimMessage;
        if (message.type === SimMessageType.INITIALIZE_DONE) {
          this.isReady = true;
          // console.timeEnd('init worker');

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
    return new Promise<SimShotResult>((resolve, reject) => {
      if (!this.isReady || !this.worker) {
        return reject('SimManager: worker does not exist or is not ready');
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
