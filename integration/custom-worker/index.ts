import {
  ConfigLoader,
  DependencyInjector,
  TInjectionConfig,
} from '@injexio/core';
import * as path from 'path';
import { configure } from 'log4js';

global.__baseDir = __dirname;

configure('./log4js.local.json');

async function main(): Promise<void> {
  const baseInjection: TInjectionConfig = ConfigLoader.load({
    configPath: path.resolve(__dirname, './config/config.worker.yaml'),
  });
  const app = await DependencyInjector.create(baseInjection);

  console.log(`Application ${app.getTag()} has been inited!`);
}

main();
