import { getLogger, Logger } from 'log4js';
import { IBase } from './interfaces';

const loggers = new WeakMap();
const tags = new WeakMap();

function getTag(): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return `${__dirname}/${this.constructor.name}`
    .replace(/^\W+/, '')
    .replace(/[/\\]/g, '.')
    .replace(/\.js$/, '');
}

function buildLogger(tag: string): Logger {
  return getLogger(`[${tag}]`);
}

export class Base implements IBase {
  constructor() {
    const tag = getTag.bind(this)();
    loggers.set(this.constructor, buildLogger(tag));
    tags.set(this.constructor, tag);
  }

  protected get _logger() {
    return loggers.get(this.constructor) || getLogger(`[${this.getTag()}]`);
  }

  async init(): Promise<void> {
    return undefined;
  }

  getTag(): string {
    return tags.get(this.constructor) || this.constructor.name;
  }
}
