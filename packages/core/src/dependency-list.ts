import { IBase } from './interfaces';

export class DependencyList<T> extends Array<T> implements IBase {
  async init(): Promise<void> {
    return undefined;
  }

  getTag(): string {
    return 'dependency list';
  }
}
