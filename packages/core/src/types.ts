import { IBase } from './interfaces';

export type TInjectionConfig = {
  classMap?: Record<string, any>;
  initialDependency: string;
  initialTimeout: number;
  dependencies: Array<TDependency>;
};

export type TDependency = {
  id: string;
  className?: any;
  dependencies: Array<string>;
  arguments: Array<any>;
  status?: 'in_progress' | 'done' | 'error';
  instance?: IBase;
};

export type TConfigModuleOptions = {
  configPath?: string;
  configNameList?: Array<string>;
};
