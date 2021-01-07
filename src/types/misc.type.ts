import { AxiosResponse } from 'axios';

export interface AxiosResponseGeneric<T = any> extends AxiosResponse {
  data: T;
}

export interface AxiosErrorData {
  attributes: any;
  error: string;
  message: string;
  statusCode: number;
}
