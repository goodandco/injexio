import { IController, IMiddleware } from '../../interfaces';
import { MiddlewareBase } from './middleware-base';
import { Express } from 'express';

export class RouterExpress extends MiddlewareBase implements IMiddleware {
  constructor(private readonly controllers: Array<IController<Express>>) {
    super();
  }

  async setup(source: Express): Promise<void> {
    for (const controller of this.controllers) {
      await controller.setup(source);
    }
  }
}
