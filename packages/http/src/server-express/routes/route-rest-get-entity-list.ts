import { RouteGet } from './route-get';

type TRESTResponseData<TItem> = {
  status: number;
  data: Array<TItem>;
  error?: string;
};

export class RouteRESTGetEntityList<TItem, TSearchParams> extends RouteGet<
  TItem,
  TSearchParams,
  TRESTResponseData<TItem>
> {}
