import {
  ConfigLoader,
  DependencyInjector,
  TInjectionConfig,
} from '@injexio/core';
import * as path from 'path';
import * as request from 'supertest';
import { IServer, IServiceResponse } from '@injexio/http';
import { configure } from 'log4js';
import * as assert from 'assert';

configure(path.resolve(__dirname, '../log4js.local.json'));
global.__baseDir = __dirname + '/../';

describe('Server tests', () => {
  describe('@injexio/* like paths', () => {
    it('should call /books endpoint successfully and get expected results', async () => {
      const configPath = path.resolve(__dirname, '../config/config.books.yaml');
      const baseInjection: TInjectionConfig = ConfigLoader.load({
        configNameList: [configPath],
      });
      const app = await DependencyInjector.create<IServer>(baseInjection);

      return request(app.getServer())
        .get('/books')
        .expect(200)
        .expect(['book1', 'book2']);
    });
  });

  describe('Relative component paths', () => {
    it('should work with compiled data from `../../dist/packages/http/src/server-express/services/response` spec', async () => {
      const configPath = path.resolve(__dirname, '../config/config.yaml');
      const baseInjection: TInjectionConfig = ConfigLoader.load({
        configNameList: [configPath],
      });
      const app = await DependencyInjector.create<IServiceResponse<string>>(
        baseInjection,
      );

      let click = 0;
      const MockResponse = {
        json(data: any): any {
          click = 1;
          return data;
        },

        end(): void {
          return;
        },
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      app.ok(MockResponse, 'hello');
      assert.equal(click, 1);
    });
  });
});
