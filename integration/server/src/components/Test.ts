import { Base } from '@injexio/core';

const Wait = (ms) => new Promise((r) => setTimeout(r, ms));
export default class Test extends Base {
  async init(): Promise<void> {
    await super.init();
    await Wait(10000);
    this.listen();
  }

  listen(): void {
    let count = 0;
    setInterval(() => {
      try {
        this._logger.info('IT IS WORKING!');
        count++;

        if (count > 5) {
          throw new Error('pizdec kakoyto');
        }
      } catch (err) {
        this._logger.error(err);
        count = 0;
      }
    }, 1000);
  }
}
