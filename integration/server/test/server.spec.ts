import {
  ConfigLoader,
  DependencyInjector,
  TInjectionConfig,
} from '@injexio/core';
import * as path from 'path';
import DependencyMap from '../src/classMap';
import * as request from 'supertest';
import { IServer } from '@injexio/http';
import { configure } from 'log4js';

configure(path.resolve(__dirname, '../log4js.json'));

describe('Server tests', () => {
  it('should be ok', async () => {
    const configPath = path.resolve(__dirname, '../config/config.yaml');
    const baseInjection: TInjectionConfig = ConfigLoader.load({
      configNameList: [configPath],
    });
    baseInjection.classMap = DependencyMap;
    const app: IServer = await DependencyInjector.create<IServer>(
      baseInjection,
    );

    return request(app.getServer())
      .get('/books')
      .expect(200)
      .expect(['book1', 'book2']);
  });
});
