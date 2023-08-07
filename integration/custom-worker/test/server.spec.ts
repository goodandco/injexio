import { DependencyInjector } from '@injexio/core';
import * as path from 'path';
import { configure } from 'log4js';
import * as assert from 'assert';
import { ICustomWorker } from '../src';

configure(path.resolve(__dirname, '../log4js.local.json'));
const Wait = ms => new Promise(r => setTimeout(r, ms));

describe('Custom worker tests', () => {
  it('should call 10 times: absolute path', async () => {
    const worker = await DependencyInjector.create<ICustomWorker>({
      initialDependency: 'Worker',
      initialTimeout: 15000,
      dependencies: [
        {
          id: 'Worker',
          className: 'CustomWorker',
          path: __dirname + '/../src/components/CustomWorker',
          arguments: [100, 10],
        },
      ],
    });

    await Wait(3000);

    return Promise.resolve().then(() => {
      assert.equal(worker.getCounter(), 10);
    });
  });

  it('should call 10 times: relative path', async () => {
    const worker = await DependencyInjector.create<ICustomWorker>({
      initialDependency: 'Worker',
      initialTimeout: 15000,
      rootDir: __dirname + '/../',
      dependencies: [
        {
          id: 'Worker',
          className: 'CustomWorker',
          path: './src/components/CustomWorker',
          arguments: [100, 10],
        },
      ],
    });

    await Wait(1500);

    return Promise.resolve().then(() => {
      assert.equal(worker.getCounter(), 10);
    });
  });
});
