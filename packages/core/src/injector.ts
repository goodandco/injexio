import {
  TDependency,
  TDependencyInit,
  TInitStatus,
  TInjectionConfig,
} from './types';
import { IBase } from './interfaces';
import { getLogger } from 'log4js';
import * as path from 'path';

const logger = getLogger(`[Injector]`);
const { DEBUG_MODE = '0' } = process.env;

const log = (
  isEnabled =>
  (msg, type: 'info' | 'warn' | 'error' = 'info') => {
    if (isEnabled) {
      const str =
        typeof msg === 'object' && msg !== null
          ? JSON.stringify(msg, null, 2)
          : msg;
      switch (type) {
        case 'warn':
          logger.warn(str);
          break;
        case 'error':
          logger.error(str);
          break;
        default:
          logger.info(str);
      }
    }
  }
)(DEBUG_MODE === '1');

export class DependencyInjector<TMainComponent extends IBase> {
  private queue: Map<string, TDependencyInit> = new Map<
    string,
    TDependencyInit
  >();

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

      try {
        const entryPointName = this.config.initialDependency;
        const result = await this.initComponent(entryPointName);
        done = true;
        if (!rejected) {
          log(Array.from(this.queue.values()));
          resolve(result as TMainComponent);
        }
      } catch (error) {
        log(Array.from(this.queue.values()));
        reject(error);
      }
    });
  }

  async initComponent(dependencyId: string): Promise<IBase> {
    const found = this.queue.has(dependencyId) && this.queue.get(dependencyId);

    if (found && found.status === TInitStatus.IN_PROGRESS) {
      return this.awaitInit(found);
    }

    if (found && found.status == TInitStatus.DONE && found.instance) {
      return found.instance;
    }
    const dependency: TDependency = this.findDependencyByName(dependencyId);

    if (!dependency)
      throw new Error(
        `A component with ID ${dependencyId} does not exists in DI configuration.`,
      );

    return this.startInit(dependency);
  }

  async startInit(dependency: TDependency): Promise<IBase> {
    const depInitConfig: TDependencyInit = {
      dependency,
      status: TInitStatus.IN_PROGRESS,
    };
    this.queue.set(dependency.id, depInitConfig);

    const dependencies = await Promise.all(
      (dependency.dependencies ?? []).map(did => this.initComponent(did)),
    );
    const rootDir = this.config.rootDir || global.__baseDir || '';
    const classPath =
      dependency.path.includes('node_modules') ||
      ['./', '..'].includes(dependency.path.slice(0, 2))
        ? path.resolve(rootDir, dependency.path)
        : dependency.path;
    const { [dependency.className]: DependencyClass } = await import(classPath);
    const deps = dependencies;
    const args = dependency.arguments ?? [];
    const instance = new DependencyClass(...deps, ...args);

    if (instance.init === undefined) {
      throw new Error(
        `The dependency "${dependency.id}" does not have init method.`,
      );
    }
    await instance.init();
    log(`Dependency ${dependency.id} has been inited`);

    depInitConfig.instance = instance;
    depInitConfig.status = TInitStatus.DONE;

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

  async awaitInit(found: TDependencyInit): Promise<IBase> {
    return new Promise((resolve, reject) => {
      setInterval(() => {
        if (found.status === TInitStatus.DONE && found.instance) {
          return resolve(found.instance);
        }

        if (found.status === TInitStatus.ERROR) {
          return reject(new Error(`${found.dependency.id} init error`));
        }
      }, 200);
    });
  }
}
