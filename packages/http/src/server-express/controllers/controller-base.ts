import { IController, IMiddleware, IRoute } from '../../interfaces';
import { Base } from '@injexio/core';
import { Express, Router } from 'express';

export class ControllerBase extends Base implements IController<Express> {
  private readonly path: string;

  constructor(
    private readonly middlewares: Array<IMiddleware>,
    private readonly routes: Array<IRoute<Router>>,
    { path = '' },
  ) {
    super();
    this.path = path;
  }

  getRoutes(): string[] {
    return this.routes.map(route => route.getRoute());
  }

  async setup(app: Express): Promise<void> {
    const router = Router();
    for (const middleware of this.middlewares) {
      if (middleware.type === 'before') {
        await middleware.setup(router);
      }
    }
    for (const route of this.routes) {
      await route.setup(router);
    }

    for (const middleware of this.middlewares) {
      if (middleware.type === 'after') {
        await middleware.setup(router);
      }
    }

    const basePath = this.path || '/';
    app.use(basePath, router);

    this._logger.info(`Controller with path ${basePath}`);
    this._logger.info(`Routes: ${this.getRoutes().join('|')}`);
  }
}
