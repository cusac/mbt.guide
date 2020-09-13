import { toast } from 'react-toastify';

export function toastError(message: string, err?: any): void {
  if (err && (err.status === 401 || err.status === 403)) {
    // These are handled in the auth-interceptor service.
    return;
  } else if (err && err.message === 'Network Error') {
    (toast as any).warning(
      'There was an issue reaching the server. Please check your internet connection and try again.'
    );
  } else {
    (toast as any).error(message);
  }
}
