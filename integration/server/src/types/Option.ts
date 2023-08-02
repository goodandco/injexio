// import { IOption } from "../interfaces";
//
// export class Option<T> implements IOption<T> {
//   constructor(private readonly value?: T | null) {
//   }
//
//   getOrElse<U>(elseValue: U): T | U {
//     return this.value ?? elseValue;
//   }
//
//   match<U, V>(some: (value: T) => V, none: () => U): V | U {
//     return this.value === null || this.value === undefined ? none() : some(this.value);
//   }
// }
