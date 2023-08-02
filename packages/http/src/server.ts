import * as express from 'express';
import { Express, Request, Response } from 'express';
import { Base } from '@injexio/core';
import { IServer } from './interfaces';

type TServerParams = {
  port: number;
  timeout: number;
  testMode: boolean;
}

export class Server extends Base implements IServer {

  private server: any;
  private readonly port: number;
  private readonly timeout: number;
  private readonly testMode: boolean;

  constructor(
    private readonly middlewares: Array<any> = [],
    { port = 3000, timeout = 10000, testMode = false }: TServerParams,
  ) {
    super();
    this.port = port;
    this.timeout = timeout;
    this.testMode = testMode;
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
      }, this.timeout);
      const app: Express = await this.getApp();
      app.get('/', (req: Request, res: Response) => {
        res.send('Test Server');
      });

      this.server = app;
      if (!this.testMode) {
        const server = app.listen(this.port, () => {
          this._logger.info(`Start server at port ${this.port}`);
          inited = true;
          resolve();
        });

        server.on('connection', (socket) => {
          socket.setNoDelay(true);
        });
      } else {
        resolve();
      }
    });
  }

  async getApp(): Promise<Express> {
    const app: Express = express();

    app.set('trust proxy', true);

    for (const middleware of this.middlewares) {
      await middleware.setup(app);
    }

    return app;
  }
}
