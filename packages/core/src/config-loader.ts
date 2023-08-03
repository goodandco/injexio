import { readFileSync } from 'fs';
import { getLogger } from 'log4js';
import * as yaml from 'js-yaml';
import {
  buildPath,
  checkFileExisting,
  deepMerge,
  replaceEnvVars,
} from './utils';
import { TInjectionConfig, TConfigModuleOptions } from './types';

const logger = getLogger(`[ConfigLoader]`);
const { NODE_ENV = 'default', DEBUG_MODE = '0' } = process.env;

export class ConfigLoader {
  static load(options: TConfigModuleOptions): TInjectionConfig {
    const configFileNames = ConfigLoader.calculateConfigFileNames(options);
    return ConfigLoader.loadByConfigFileNames(configFileNames);
  }

  static calculateConfigFileNames(options: TConfigModuleOptions) {
    const { configNameList = null } = options;
    const defaultConfig = `/config/config.yaml`;
    const defaultEnvConfig = `/config/config.${NODE_ENV}.yaml`;

    const defaultConfigNameList = process.argv.includes('--configPath')
      ? [process.argv[process.argv.indexOf('--configPath') + 1]]
      : [defaultConfig, defaultEnvConfig];

    return (configNameList || defaultConfigNameList)
      .map(configName => buildPath(configName))
      .filter(configPathName => checkFileExisting(configPathName));
  }

  static loadByConfigFileNames(
    configFileNameList: Array<string>,
  ): TInjectionConfig {
    const configList = configFileNameList.map((configPathName: string) =>
      ConfigLoader.read(configPathName),
    ) as Array<TInjectionConfig>;

    const result: TInjectionConfig = deepMerge(...configList.reverse());

    if (DEBUG_MODE === '1') {
      logger.info('NODE_ENV ' + NODE_ENV);
      logger.info(
        `Considered config files: \n -` + configFileNameList.join(',\n - '),
      );
      logger.info(`Result config: \n${JSON.stringify(result, null, 2)}`);
    }

    return result;
  }

  static read(
    configPathName: string,
  ): TInjectionConfig | Partial<TInjectionConfig> {
    try {
      return yaml.load(
        replaceEnvVars(readFileSync(configPathName, 'utf8')),
      ) as TInjectionConfig;
    } catch (err) {
      logger.error('And error happened while reading config: ' + err.message);
      return {} as Partial<TInjectionConfig>;
    }
  }
}
