/**
 * The following models might not match the model schemas defined in the backend,
 * but rather the structure of the data returned by the backend (sometimes formatted
 * for optimal use in the frontend).
 */

import { User, Permission, AssignedPermissionState } from '../index';

export interface Group {
  _id: string;
  createdAt?: string;
  users?: User[] | GroupUser[];
  permissions?: Permission[] | GroupPermission[];
  name: string;
  description: string;
}
export function isGroup(obj: any): obj is Group {
  return (
    obj !== undefined &&
    (obj as Group)._id !== undefined &&
    (obj as Group).name !== undefined &&
    (obj as Group).description !== undefined
  );
}

export interface GroupUser {
  user: User;
}
export function isGroupUser(obj: any): obj is GroupUser {
  return obj !== undefined && (obj as GroupUser).user !== undefined;
}

export interface GroupPermission {
  permission: Permission;
  state: AssignedPermissionState;
}
export function isGroupPermission(obj: any): obj is GroupPermission {
  return obj !== undefined && (obj as GroupPermission).permission !== undefined;
}
