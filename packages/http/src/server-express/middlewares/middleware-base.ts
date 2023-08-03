import { IMiddleware, IMiddlewareSource } from '../../interfaces';
import { Base } from '@injexio/core';

export class MiddlewareBase extends Base implements IMiddleware {
  get type(): 'before' | 'after' {
    return 'before';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setup(source: IMiddlewareSource): Promise<void> {
    // should be implemented in successor
  }
}
