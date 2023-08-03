import { DependencyList, IBase, Base } from '@injexio/core';
import {
  ExpressServer,
  RouterExpress,
  ControllerREST,
  RouteRESTGetEntityList,
  ResponseService,
} from '@injexio/http';
import { Test } from './components/Test';
import { CollectRequestDataGetList } from './services/CollectRequestDataGetList';
import { ServiceDataBooks } from './services/ServiceDataBooks';

interface IClass<T extends IBase> {
  new (...args: any[]): T;
}

// function newInstance<T extends Base>(TheClass: Class<T>, ...args: any[]): T {
//   return new TheClass(...args);
// }

export default {
  'Component.Base': Base,
  'Component.DependencyList': DependencyList,
  'Component.Server': ExpressServer,
  'Middleware.Router': RouterExpress,
  'Controller.REST': ControllerREST,
  'Component.Test': Test,
  'Route.Books.GetList': RouteRESTGetEntityList,
  'Service.REST.CollectRequestData.GetList': CollectRequestDataGetList,
  'Service.Data.Books': ServiceDataBooks,
  'Service.REST.Response.List': ResponseService,
} as Record<string, IClass<IBase>>;
