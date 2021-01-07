/**
 * The following models might not match the model schemas defined in the backend,
 * but rather the structure of the data returned by the backend (sometimes formatted
 * for optimal use in the frontend).
 */

export type Tag = {
  _id?: string;
  name: string;
};
