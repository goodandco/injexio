import { IBase } from './interfaces';

export type TInjectionConfig = {
  initialDependency: string;
  initialTimeout: number;
  rootDir?: string;
  dependencies: Array<TDependency>;
};

export type TDependency = {
  id: string;
  className: any;
  isDefault?: boolean;
  path: string;
  dependencies?: Array<string>;
  arguments?: Array<any>;
};

export enum TInitStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export type TDependencyInit = {
  dependency: TDependency;
  status: TInitStatus;
  instance?: IBase;
};

export type TConfigModuleOptions = {
  configPath?: string;
  configNameList?: Array<string>;
};
