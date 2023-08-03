import { Base } from '@injexio/core';
import { IServiceResponse } from '../../interfaces';
import { Response } from 'express';

export class ResponseService<T> extends Base implements IServiceResponse<T> {
  ok(response: Response<T>, payload: any): void {
    response.json(payload);
    response.end();
  }

  error(response: Response, error: Error): void {
    response.json({
      status: 200,
      error: error.message,
    });
    response.end();
  }
}
