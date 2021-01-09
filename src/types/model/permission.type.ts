/**
 * The following models might not match the model schemas defined in the backend,
 * but rather the structure of the data returned by the backend (sometimes formatted
 * for optimal use in the frontend).
 */

import { Group, User } from '../index';

export interface Permission {
  _id: string;
  createdAt?: string;
  users?: User[];
  groups?: Group[];
  name: string;
  description: string;
  assignScope: [string];
}
export function isPermission(obj: any): obj is Permission {
  return (
    obj !== undefined &&
    (obj as Permission)._id !== undefined &&
    (obj as Permission).name !== undefined &&
    (obj as Permission).description !== undefined &&
    (obj as Permission).assignScope !== undefined
  );
}
