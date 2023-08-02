import { readFileSync, existsSync } from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import deepMerge from './utils';
import { TInjectionConfig, TConfigModuleOptions } from './types';

let CONFIG: TInjectionConfig | null = null;

export class ConfigLoader {
  static read(
    configPathName: string,
  ): TInjectionConfig | Partial<TInjectionConfig> {
    try {
      return yaml.load(
        ConfigLoader.replaceEnvVars(readFileSync(configPathName, 'utf8')),
      ) as TInjectionConfig;
    } catch (err) {
      console.log('And error happened while reading config: ', err.message);
      return {} as Partial<TInjectionConfig>;
    }
  }

  static replaceEnvVars(content): string {
    return content.replace(/\${([A-Z0-9_]+(|[^}]+)?)}/gi, (_, entry) => {
      // eslint-disable-next-line prefer-const
      let [name, defaultValue] = entry.split('|');
      name = name.trim();

      if (process.env[name]) {
        return process.env[name];
      }

      if (defaultValue) {
        return defaultValue.trim();
      }

      throw new Error(`Env variable '${name}' is not set`);
    });
  }

  static load(options: TConfigModuleOptions): TInjectionConfig {
    const { configNameList = null } = options;

    if (CONFIG) {
      return CONFIG;
    }
    const { NODE_ENV: env = 'default' } = process.env;
    console.log('NODE_ENV ', env);
    const defaultConfig = `/config/config.yaml`;
    const defaultEnvConfig = `/config/config.${env}.yaml`;

    const defaultConfigNameList = process.argv.includes('--configPath')
      ? [process.argv[process.argv.indexOf('--configPath') + 1]]
      : [defaultConfig, defaultEnvConfig];

    const list = configNameList || defaultConfigNameList;
    const configList = list
      .map(configName => ConfigLoader.buildPath(configName))
      .filter(configPathName => ConfigLoader.checkFileExisting(configPathName))
      .map((configPathName: string) =>
        ConfigLoader.read(configPathName),
      ) as Array<TInjectionConfig>;

    CONFIG = deepMerge(...configList.reverse());
    console.log(JSON.stringify(CONFIG));
    return CONFIG;
  }

  static buildPath(fileName: string): string {
    if (fileName[0] === '/') {
      return fileName;
    }
    const baseDir = global.__baseDir || './';
    const configpath = path.join(baseDir, fileName);
    return configpath;
  }

  static checkFileExisting(filePathName: string): boolean {
    try {
      return existsSync(filePathName);
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  static config(options?: TConfigModuleOptions): TInjectionConfig {
    if (!CONFIG) {
      ConfigLoader.load(options);
    }

    return CONFIG;
  }
}
