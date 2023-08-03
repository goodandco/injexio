import { IMiddleware, IMiddlewareSource } from '../../interfaces';
import { Base } from '@injexio/core';

export class MiddlewareBase extends Base implements IMiddleware {
  get type(): 'before' | 'after' {
    return 'before';
  }

  async setup(source: IMiddlewareSource): Promise<void> {
    await Promise.resolve();
  }
}
