import { readFileSync } from 'fs';
import { getLogger } from 'log4js';
import * as yaml from 'js-yaml';
import {
  buildPath,
  checkFileExisting,
  clone,
  deepMerge,
  replaceEnvVars,
} from './utils';
import { TInjectionConfig, TConfigModuleOptions } from './types';

const logger = getLogger(`[ConfigLoader]`);
const { NODE_ENV = 'default', DEBUG_MODE = '0' } = process.env;

export class ConfigLoader {
  static load(
    options: TConfigModuleOptions,
    isModule = false,
  ): TInjectionConfig {
    const configFileNames = ConfigLoader.calculateConfigFileNames(options);
    const result = ConfigLoader.loadByConfigFileNames(
      configFileNames,
      isModule,
    );

    if (options.rootDir) {
      result.rootDir = options.rootDir;
    }

    return result;
  }

  static calculateConfigFileNames(options: TConfigModuleOptions) {
    const { configNameList = null } = options;
    const defaultConfig = `/config/config.yaml`;
    const defaultEnvConfig = `/config/config.${NODE_ENV}.yaml`;

    const defaultConfigNameList = process.argv.includes('--configPath')
      ? [process.argv[process.argv.indexOf('--configPath') + 1]]
      : [defaultConfig, defaultEnvConfig];

    return (configNameList || defaultConfigNameList)
      .map(configName => buildPath(configName, options.rootDir))
      .filter(configPathName => checkFileExisting(configPathName));
  }

  static loadByConfigFileNames(
    configFileNameList: Array<string>,
    isModule = false,
  ): TInjectionConfig {
    const configList = configFileNameList.reduce(
      (res, configPathName: string) => {
        const config = ConfigLoader.read(configPathName);
        if (config.use && config.use.length > 0) {
          const moduleConfig = ConfigLoader.load(
            {
              configNameList: config.use,
            },
            true,
          );

          return [...res, config, moduleConfig];
        }

        return [...res, config];
      },
      [],
    ) as Array<TInjectionConfig>;

    configList.reverse();

    const result: TInjectionConfig = ConfigLoader.mergeConfigs(
      isModule,
      ...configList,
    );

    if (DEBUG_MODE === '1' && !isModule) {
      logger.info('NODE_ENV ' + NODE_ENV);
      logger.info(
        `Considered config files: \n -` + configFileNameList.join(',\n - '),
      );
      logger.info(
        `Considered configs: \n${JSON.stringify(configList, null, 2)}`,
      );
      logger.info('----------------');
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

  static mergeConfigs(
    isModule = false,
    ...configs: Array<TInjectionConfig | Partial<TInjectionConfig>>
  ): TInjectionConfig {
    return <TInjectionConfig>configs.reduce((main, config) => {
      if (!main) {
        return clone(config);
      }

      const mainDepsWithRewrites = main.dependencies.map(md => {
        const foundRewrite = config.dependencies.find(d => d.id === md.id);

        return deepMerge(md, foundRewrite) || md;
      });

      const newDependencies = config.dependencies.filter(
        d => mainDepsWithRewrites.find(od => od.id === d.id) === undefined,
      );

      main.dependencies = [...mainDepsWithRewrites, ...newDependencies];

      for (const key of ['rootDir', 'initialDependency', 'initialTimeout']) {
        if (config[key]) {
          main[key] = config[key];
        }
      }

      return main;
    }, null);
  }
}
