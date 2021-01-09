/**
 * The following models might not match the model schemas defined in the backend,
 * but rather the structure of the data returned by the backend (sometimes formatted
 * for optimal use in the frontend).
 */

import { AssignedPermissionState, Permission, User } from '../index';

export type RoleName = 'User' | 'Admin' | 'Super Admin';

export interface Role {
  _id: string;
  createdAt?: string;
  users?: User[] | RoleUser[];
  permissions?: Permission[] | RolePermission[];
  name: RoleName;
  rank: number;
  description: string;
}
export function isRole(obj: any): obj is Role {
  return (
    obj !== undefined &&
    (obj as Role)._id !== undefined &&
    (obj as Role).name !== undefined &&
    (obj as Role).rank !== undefined &&
    (obj as Role).description !== undefined
  );
}

export interface RoleUser {
  user: User;
}
export function isRoleUser(obj: any): obj is RoleUser {
  return obj !== undefined && (obj as RoleUser).user !== undefined;
}

export interface RolePermission {
  permission: Permission;
  state: AssignedPermissionState;
}
export function isRolePermission(obj: any): obj is RolePermission {
  return obj !== undefined && (obj as RolePermission).permission !== undefined;
}
