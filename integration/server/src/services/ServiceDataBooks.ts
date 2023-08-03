import { IServiceData, ServiceData } from '@injexio/http';

export class ServiceDataBooks
  extends ServiceData<string>
  implements IServiceData<any>
{
  async init(): Promise<void> {
    return new Promise<void>(r => {
      setTimeout(r, 300);
    });
  }

  async find<TSearch = string>(payload: TSearch): Promise<Array<string>> {
    return ['book1', 'book2'];
  }
}
