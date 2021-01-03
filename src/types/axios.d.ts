import axios, { AxiosResponse } from 'axios';

declare module 'axios' {
  export interface AxiosResponseGeneric<T = any> extends AxiosResponse {
    data: T;
  }
}
