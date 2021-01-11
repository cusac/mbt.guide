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
  console.error(`${file}.${method}-error:\n`, err);

  // TODO: Fix the network error issue. Right now we aren't reporting them to sentry to keep from filling up the quota.
  if (err && err.message === 'Network Error') {
    return;
  }

  Sentry.withScope(function(scope) {
    if (err instanceof Error) {
      scope.setTag('file', file);
      scope.setTag('method', method);
      Sentry.captureException(err);
    }
  });
}
