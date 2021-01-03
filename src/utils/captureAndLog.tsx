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

  Sentry.withScope(function(scope) {
    if (err instanceof Error) {
      scope.setTag('file', file);
      scope.setTag('method', method);
      Sentry.captureException(err);
    }
  });
}
