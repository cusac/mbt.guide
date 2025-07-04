import * as Sentry from '@sentry/browser';

export default function captureAndLog({
  file,
  method,
  err,
}: {
  file: string;
  method: string;
  err: any;
}): void {
  console.error(`Error in ${file}.${method}:`, err);
  Sentry.captureException(err);
}
