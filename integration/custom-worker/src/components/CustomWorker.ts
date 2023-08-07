import { Base, IBase } from '@injexio/core';

const Wait = ms => new Promise(r => setTimeout(r, ms));

export interface ICustomWorker extends IBase {
  getCounter(): number;
}

export class CustomWorker extends Base implements ICustomWorker {
  private counter = 0;

  constructor(
    private readonly timeout: number = 100,
    private readonly maxCounts: number = 5,
  ) {
    super();
  }

  async init(): Promise<void> {
    await super.init();
    await Wait(500);
    this.listen();
  }

  getCounter() {
    return this.counter;
  }

  listen(): void {
    const interval = setInterval(() => {
      try {
        this._logger.info('IT IS WORKING!');
        this.counter++;

        if (this.counter >= this.maxCounts) {
          clearInterval(interval);
        }
      } catch (err) {
        this._logger.error(err);
      }
    }, this.timeout);
  }
}
