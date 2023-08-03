import { TDependency, TInjectionConfig } from './types';
import { IBase } from './interfaces';
import { getLogger, Logger } from 'log4js';

const logger = getLogger(`[Injector]`);

const STATUS_DONE = 'done';
const STATUS_IN_PROGRESS = 'in_progress';

export class DependencyInjector<TMainComponent extends IBase> {
  constructor(private config: TInjectionConfig) {}

  static async create<TMainComponent extends IBase>(
    config: TInjectionConfig,
  ): Promise<TMainComponent> {
    return new DependencyInjector<TMainComponent>(config).init();
  }

  async init(): Promise<TMainComponent> {
    return new Promise<TMainComponent>(async (resolve, reject) => {
      let rejected = false;
      let done = false;
      const initialTimeout = this.config.initialTimeout || 1000;
      setTimeout(() => {
        if (!done) {
          rejected = true;
          reject(
            new Error(
              `Initial timeout for ${initialTimeout} ms has been exceeded.`,
            ),
          );
        }
      }, initialTimeout);
      const entryPointName = this.config.initialDependency;
      const result = await this.initComponent(entryPointName);
      done = true;
      if (!rejected) {
        resolve(result as TMainComponent);
      }
    });
  }

  async initComponent(dependencyName: string): Promise<IBase> {
    const dependency: TDependency = this.findDependencyByName(dependencyName);

    if (!dependency) throw new Error(`no such component ${dependencyName}`);
    if (dependency.status === STATUS_DONE && dependency.instance)
      return dependency.instance;
    if (dependency.status === STATUS_IN_PROGRESS)
      return this.awaitInit(dependencyName);

    return this.startInit(dependency);
  }

  async startInit(dependency: TDependency): Promise<IBase> {
    // eslint-disable-next-line no-param-reassign
    dependency.status = STATUS_IN_PROGRESS;

    const dependencies = await Promise.all(
      (dependency.dependencies ?? []).map(d => this.initComponent(d)),
    );
    const DependencyClass = this.config.classMap[dependency.className];
    const deps = dependencies;
    const args = dependency.arguments ?? [];
    const instance = new DependencyClass(...deps, ...args);
    if (instance.init === undefined) {
      throw new Error(
        `The dependency "${dependency.id}" does not have init method.`,
      );
    }
    await instance.init();
    logger.info(`Dependency ${dependency.id} has been inited`);

    // eslint-disable-next-line no-param-reassign
    dependency.instance = instance;
    // eslint-disable-next-line no-param-reassign
    dependency.status = STATUS_DONE;

    return instance;
  }

  findDependencyByName(componentName: string): TDependency {
    const result = this.config.dependencies.find(
      dependency => dependency.id === componentName,
    );

    if (!result) {
      throw new Error(`There is no dependency config for ${componentName}`);
    }

    return result;
  }

  async awaitInit(componentName: string): Promise<IBase> {
    const componentConfig = this.findDependencyByName(componentName);

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line consistent-return
      setInterval(() => {
        if (
          componentConfig.status === STATUS_DONE &&
          componentConfig.instance
        ) {
          return resolve(componentConfig.instance);
        }

        if (componentConfig.status === 'error') {
          return reject(new Error(`${componentName} init error`));
        }
      }, 200);
    });
  }
}
