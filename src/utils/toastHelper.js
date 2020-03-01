// @flow
import { toast } from 'react-toastify';

export function toastError(message: string, err: any): void {
  if (err && (err.status === 401 || err.status === 403)) {
    // These are handled in the auth-interceptor service.
    return;
  } else {
    toast.error(message);
  }
}
