import { IServiceData } from '../../interfaces';
import { Base } from '@injexio/core';

export class ServiceData<T = any> extends Base implements IServiceData<T> {
  async find<TSearch>(
    payload: TSearch,
    ...args: Array<any>
  ): Promise<Array<T>> {
    return [];
  }

  async findOne(payload: any, ...args: Array<any>): Promise<T | null> {
    const [result = null] = await this.find(payload, ...args);

    return result;
  }
}
