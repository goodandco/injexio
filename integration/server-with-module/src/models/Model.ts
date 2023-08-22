// import { IModel } from "../interfaces";
// import { Option } from "../types/Option";
//
// export abstract class Model<T> implements IModel<T> {
//   find<U>(conditions: U, limit: number): Promise<Array<T>> {
//     const result = await this._find(conditions, limit);
//     return (limit ? result.slice(0, limit) : result)
//       .reduce(
//         (acc, item) => {
//           const record = this.createRecord(item);
//           if (record) {
//             acc.push(record);
//           }
//           return acc;
//         },
//         []
//       );
//   }
//
//   findPrimary<U>(id: U): Promise<T | undefined> {
//     const conditions = {
//       [this._primaryField]: primaryKey,
//     };
//     const result = await this.find(conditions, 1);
//
//     return new Option(result.slice(0, 1).pop());
//   }
//
//   createRecord(data) /*: ?$PropertyType<this, "_schema"> */ {
//     try {
//       /* eslint-disable-next-line new-cap */
//       return new (this.schema)(data);
//     }
//     catch (err) {
//       this._logger.warn(this.schema.toString(), "Malformed record", data, err);
//     }
//     return null;
//   }
// }
