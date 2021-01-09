/**
 * The following models might not match the model schemas defined in the backend,
 * but rather the structure of the data returned by the backend (sometimes formatted
 * for optimal use in the frontend).
 */

import { Group, Permission, Role, RoleName } from '../index';

export type AssignedPermissionState = 'Included' | 'Excluded' | 'Forbidden';

export interface User {
  _id: string;
  createdAt?: string;
  groups?: Group[] | UserGroup[];
  permissions?: Permission[] | UserPermission[];
  role: Role | Role['_id'];
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string;
  isEnabled: boolean;
  isActive: boolean;
  roleName: RoleName;
  passwordUpdateRequired: boolean;
  pinUpdateRequired: boolean;
}
export function isUser(obj: any): obj is User {
  return (
    obj !== undefined &&
    (obj as User)._id !== undefined &&
    (obj as User).firstName !== undefined &&
    (obj as User).lastName !== undefined &&
    (obj as User).email !== undefined
  );
}

export interface UserGroup {
  group: Group;
}
export function isUserGroup(obj: any): obj is UserGroup {
  return obj !== undefined && (obj as UserGroup).group !== undefined;
}

export interface UserPermission {
  permission: Permission;
  state: AssignedPermissionState;
}
export function isUserPermission(obj: any): obj is UserPermission {
  return obj !== undefined && (obj as UserPermission).permission !== undefined;
}
