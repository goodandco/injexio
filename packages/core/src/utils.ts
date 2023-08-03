import * as path from 'path';
import { existsSync } from 'fs';

export function clone<T = any>(value: T) {
  return value && !isPrimitive(value)
    ? JSON.parse(JSON.stringify(value))
    : value;
}

export function isPrimitive<T = any>(value: T): boolean {
  return ['number', 'string', 'boolean'].includes(typeof value);
}

export function mergeArrays(
  destination: Array<any>,
  source: Array<any>,
): Array<any> {
  const result = clone<Array<any>>(destination);
  for (let i = 0; i < source.length; i++) {
    const sourceValue = source[i];
    const destinationValue = result[i];

    if (!Reflect.has(result, i)) {
      result[i] = source[i];
    } else if (Array.isArray(sourceValue) && Array.isArray(destinationValue)) {
      result[i] = mergeArrays(destinationValue, sourceValue);
    } else if (!isPrimitive(destinationValue)) {
      result[i] = mergeObjects(destinationValue, sourceValue);
    }
  }

  return result;
}

export function mergeObjects(destination, source) {
  if (!source) {
    return destination;
  }

  const result = clone(destination) || {};

  Object.keys(source).forEach(property => {
    const sourceValue = source[property];

    if (!Reflect.has(result, property)) {
      result[property] = sourceValue;
      return;
    }

    const destinationValue = result[property];

    if (isPrimitive(sourceValue)) {
      return;
    }

    if (Array.isArray(sourceValue) && Array.isArray(destinationValue)) {
      result[property] = mergeArrays(destinationValue, sourceValue);
      return;
    }

    result[property] = mergeObjects(destinationValue, sourceValue);
  });

  return result;
}

export function deepMerge(...objects) {
  if (!objects.length) {
    return {};
  }

  if (objects.length === 1) {
    return objects[0];
  }

  const destination = objects.shift();
  const source = objects.shift();
  const result = mergeObjects(destination, source);

  return deepMerge(result, ...objects);
}

export function buildPath(fileName: string): string {
  if (fileName[0] === '/') {
    return fileName;
  }
  const baseDir = global.__baseDir || './';
  return path.join(baseDir, fileName);
}

export function checkFileExisting(filePathName: string): boolean {
  try {
    return existsSync(filePathName);
  } catch (err) {
    return false;
  }
}

export function replaceEnvVars(content): string {
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
