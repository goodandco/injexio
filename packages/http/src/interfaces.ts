import { Express, Response } from 'express';
import { IBase } from '@injexio/core';

export interface IServer extends IBase {
  getServer(): Express;
}

export interface IMiddlewareSource {
  use(ent: any): any;
}

export interface IMiddleware extends IBase {
  type: 'before' | 'after';

  setup(source: IMiddlewareSource): Promise<void>;
}

export interface IController<TServer> extends IBase {
  setup(server: TServer): Promise<void>;

  getRoutes(): Array<string>;
}

export interface IRoute<TRouter> extends IBase {
  setup(router: TRouter): Promise<void>;

  getRoute(): string;
}

export interface IServiceData<T> extends IBase {
  find<TSearch>(payload: TSearch): Promise<Array<T>>;

  find<TSearch>(payload: TSearch, ...args: Array<any>): Promise<Array<T>>;

  findOne<TSearch>(payload: TSearch): Promise<T | null>;

  findOne<TSearch>(payload: TSearch, ...args: Array<any>): Promise<T | null>;
}

export interface IServiceResponse<TResponseData> extends IBase {
  ok(response: Response<TResponseData>, payload: any): void;

  error(response: Response, error: Error): void;
}
