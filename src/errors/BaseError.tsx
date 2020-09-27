export default class BaseError extends Error {
  constructor(...args: Array<any>) {
    super(...args);
    Error.captureStackTrace(this, BaseError);
  }
}
