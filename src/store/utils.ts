import { AxiosResponse } from 'axios';
import { AxiosErrorData } from 'types';

/**
 * This is a utility function that handles errors passed to redux actions.
 * It is meant to simplify the error payload to avoid action payload serialization issues.
 * @param err The error to be parsed
 */
export const parseError = (err: Error | AxiosResponse): Error | AxiosErrorData => {
  return 'data' in err ? err.data : err;
};
