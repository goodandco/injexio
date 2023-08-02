export interface IBase {
  init(): Promise<void>;

  getTag(): string;
}

export interface IOption<T> {
  getOrElse<U>(elseValue: U): T | U;

  match<U, V>(some: (value: T) => V, none: () => U): V | U;

  // map<U, V, P>(some: (value: T) => V | Promise<V>): IOption<V | undefined> | Promise<IOption<V | undefined>>
}
