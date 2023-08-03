import * as express from 'express';
import { Express, Request, Response } from 'express';
import { Base } from '@injexio/core';
import { IMiddleware, IServer } from '../interfaces';

type TServerParams = {
  port: number;
  timeout: number;
  testMode: boolean;
  trustProxy: boolean;
};

export class Server extends Base implements IServer {
  private server: any;

  constructor(
    private readonly middlewares: Array<IMiddleware> = [],
    private params: TServerParams,
  ) {
    super();
  }

  getServer(): Express {
    return this.server;
  }

  async init() {
    return new Promise<void>(async (resolve, reject) => {
      let inited = false;
      setTimeout(() => {
        if (!inited) {
          reject(`The Server wasn't started in 10 sec`);
        }
      }, this.params.timeout);
      const app: Express = await this.getApp();
      // app.get('/', (req: Request, res: Response) => {
      //   res.send('Test Server');
      // });

      this.server = app;
      if (!this.params.testMode) {
        const server = app.listen(this.params.port, () => {
          this._logger.info(`Start server at port ${this.params.port}`);
          inited = true;
          resolve();
        });

        server.on('connection', socket => {
          socket.setNoDelay(true);
        });
      } else {
        inited = true;
        resolve();
      }
    });
  }

  async getApp(): Promise<Express> {
    const app: Express = express();
    if (this.params.trustProxy) {
      app.set('trust proxy', true);
    }

    for (const middleware of this.middlewares) {
      await middleware.setup(app);
    }

    return app;
  }
}
