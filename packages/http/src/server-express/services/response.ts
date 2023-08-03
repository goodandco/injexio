import { Base } from '@injexio/core';
import { IServiceResponse } from '../../interfaces';
import { Response } from 'express';

export class ResponseService<T> extends Base implements IServiceResponse<T> {
  ok<TResponseData>(response: Response, payload: any): void {
    response.json(payload);
    response.end();
  }

  error(response: Response, error: Error): void {
    response.status(500);
    response.json({
      error: error.message,
    });
    response.end();
  }
}
