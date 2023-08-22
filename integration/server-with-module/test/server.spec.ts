import {
  ConfigLoader,
  DependencyInjector,
  TInjectionConfig,
} from '@injexio/core';
import * as path from 'path';
import * as request from 'supertest';
import { IServer } from '@injexio/http';
import { configure } from 'log4js';

configure(path.resolve(__dirname, '../log4js.local.json'));
global.__baseDir = __dirname + '/../';

describe('Server Module tests', () => {
  describe('@injexio/* like paths', () => {
    it('should call /books endpoint successfully and get expected results', async () => {
      const baseInjection: TInjectionConfig = ConfigLoader.load({
        rootDir: __dirname + '/../',
        configNameList: ['./config/config.yaml'],
      });

      console.log(JSON.stringify(baseInjection, null, 2));
      const app = await DependencyInjector.create<IServer>(baseInjection);

      return request(app.getServer())
        .get('/books')
        .expect(200)
        .expect(['book1', 'book2']);
    });
  });
});
