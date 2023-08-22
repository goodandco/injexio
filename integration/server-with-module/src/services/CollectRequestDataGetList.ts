import { IServiceData, ServiceData } from '@injexio/http';

export class CollectRequestDataGetList
  extends ServiceData<string>
  implements IServiceData<any>
{
  async find<TSearch = string>(payload: TSearch): Promise<Array<string>> {
    return ['my search options'];
  }
}
