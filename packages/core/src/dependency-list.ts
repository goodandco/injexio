import { IBase } from './interfaces';

export class DependencyList extends Array implements IBase {
  async init(): Promise<void> {
     return Promise.resolve();
  }

  getTag(): string {
    return 'dependency list';
  }
}
