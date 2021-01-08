import { AxiosPromise } from 'axios';
import { httpClient as http } from '../services';
import { LoginResponse } from '../store';
import { AxiosResponseGeneric } from '../types';

export const loginCall = ({
  idToken,
  email,
  password,
  displayName,
}: {
  idToken?: string;
  email?: string;
  password?: string;
  displayName?: string;
}): Promise<AxiosResponseGeneric<LoginResponse>> => {
  return http.post<LoginResponse>('/login', { idToken, email, password, displayName });
};

export const logoutCall = (): AxiosPromise<void> => {
  return http.delete<void>('/logout');
};
