import {
  IMiddleware,
  IRoute,
  IServiceData,
  IServiceResponse,
} from '../../interfaces';
import { Router, Request, Response } from 'express';
import { Base } from '@injexio/core';

type TRouterParams = {
  path: string;
  params: Record<string, any>;
  query: Record<string, any>;
};

export class RouteGet<TServiceData, TSearchParams, TResponseData>
  extends Base
  implements IRoute<Router>
{
  constructor(
    private readonly middlewares: Array<IMiddleware>,
    private readonly inputService: IServiceData<TSearchParams>,
    private readonly dataService: IServiceData<TServiceData>,
    private readonly responseService: IServiceResponse<TResponseData>,
    private readonly params: TRouterParams,
  ) {
    super();
  }

  getRoute(): string {
    return this.params.path;
  }

  async setup(router: Router): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware.type === 'before') {
        await middleware.setup(router);
      }
    }

    const path = this.params.path || '/';

    router.get(path, this.handleRequest.bind(this));

    for (const middleware of this.middlewares) {
      if (middleware.type === 'after') {
        await middleware.setup(router);
      }
    }
  }

  protected async handleRequest(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const searchParams = await this.inputService.findOne<Request>(request);
      const data = await this.dataService.find<TSearchParams>(searchParams);
      this.responseService.ok<TResponseData>(response, data);
    } catch (error) {
      this.responseService.error(response, error);
    }
  }
}
