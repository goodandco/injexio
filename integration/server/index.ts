// requirement for handling source map in error tracing.
// Alternative is to run node in the way: node -r source-map-support/register index
// import 'source-map-support/register';
import { configure } from 'log4js';
import {
  ConfigLoader,
  DependencyInjector,
  TInjectionConfig,
} from '@injexio/core';
import DependencyMap from './src/classMap';
import * as path from 'path';

global.__baseDir = __dirname.replace('/dist', '');

configure('./log4js.local.json');

async function main(): Promise<void> {
  const baseInjection: TInjectionConfig = ConfigLoader.load({
    configPath: path.resolve(__dirname, './config/config.yaml'),
  });
  baseInjection.classMap = DependencyMap;
  const app = await DependencyInjector.create(baseInjection);

  console.log(`Application ${app.getTag()} has been inited!`);
}

main();
