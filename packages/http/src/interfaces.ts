import { Express } from 'express';
import { IBase } from '@injexio/core';

export interface IServer extends IBase{
  getServer(): Express;
}