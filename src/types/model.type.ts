/**
 * The following models might not match the model schemas defined in the backend,
 * but rather the structure of the data returned by the backend (sometimes formatted
 * for optimal use in the frontend).
 *
 * This file also provides typeguard functions to help verify the different model types.
 */

import { v4 as uuid } from 'uuid';
import { isArray } from 'lodash';
import captureAndLog from '../utils/captureAndLog';

export type ModelType =
  | 'User'
  | 'UserGroup'
  | 'UserPermission'
  | 'Role'
  | 'RoleUser'
  | 'RolePermission'
  | 'Group'
  | 'GroupUser'
  | 'GroupPermission'
  | 'Permission'
  | 'Message'
  | 'Conversation'
  | 'Notification';

export type RoleName = 'User' | 'Admin' | 'Super Admin';

export type ChatType = 'direct' | 'group';

export type AssignedPermissionState = 'Included' | 'Excluded' | 'Forbidden';

//#region User
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
//#endregion

//#region Role
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
//#endregion

//#region Group
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
//#endregion Group

//#region Permission
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
//#endregion

export interface Message {
  _id: string;
  createdAt?: string;
  user: User | User['_id'];
  conversation: Conversation | Conversation['_id'];
  text: string;
  me?: boolean;
}
export function isMessage(obj: any): obj is Message {
  return (
    obj !== undefined &&
    (obj as Message)._id !== undefined &&
    (obj as Message).user !== undefined &&
    (obj as Message).conversation !== undefined &&
    (obj as Message).text !== undefined
  );
}

export interface Conversation {
  _id: string;
  createdAt?: string;
  users: User[];
  messages?: Message[];
  lastMessage?: Message | Message['_id'];
  name?: string;
  hasRead: boolean;
  chatType: ChatType;
}
export function isConversation(obj: any): obj is Conversation {
  return (
    obj !== undefined &&
    (obj as Conversation)._id !== undefined &&
    (obj as Conversation).chatType !== undefined &&
    (obj as Conversation).hasRead !== undefined
  );
}

export interface Notification {
  _id: string;
  createdAt?: string;
  actingUser: User | User['_id'];
  hasRead: boolean;
  message: string;
}
export function isNotification(obj: any): obj is Notification {
  return (
    obj !== undefined &&
    (obj as Notification)._id !== undefined &&
    (obj as Notification).actingUser !== undefined &&
    (obj as Notification).hasRead !== undefined &&
    (obj as Notification).message !== undefined
  );
}

export function tempId(): string {
  return 'TEMP_ID_' + uuid();
}

/**
 * A generic type checker with options to log or throw an error when the result is false.
 * @param obj The object to verify
 * @param modelType The type to check against
 * @param verify (default: false) If true, an error will be logged or thrown if the variable is not the given type.
 * @param throwError (default: false) If true an error will be thrown, if false the error will only be logged
 */
export function isModelType<T>(
  obj: any,
  modelType: ModelType,
  verify = false,
  throwError = false
): obj is T {
  function handleTypeError() {
    if (verify) {
      const err = new Error('obj is not type ' + modelType + ': ' + JSON.stringify(obj));
      if (throwError) {
        throw err;
      } else {
        captureAndLog({
          file: 'modelType',
          method: 'isModelType',
          err,
        });
      }
    }
  }

  switch (modelType) {
    case 'User':
      if (!isUser(obj)) {
        handleTypeError();
      }
      return isUser(obj);
    case 'UserGroup':
      if (!isUserGroup(obj)) {
        handleTypeError();
      }
      return isUserGroup(obj);
    case 'UserPermission':
      if (!isUserPermission(obj)) {
        handleTypeError();
      }
      return isUserPermission(obj);
    case 'Role':
      if (!isRole(obj)) {
        handleTypeError();
      }
      return isRole(obj);
    case 'RoleUser':
      if (!isRoleUser(obj)) {
        handleTypeError();
      }
      return isRoleUser(obj);
    case 'RolePermission':
      if (!isRolePermission(obj)) {
        handleTypeError();
      }
      return isRolePermission(obj);
    case 'Group':
      if (!isGroup(obj)) {
        handleTypeError();
      }
      return isGroup(obj);
    case 'GroupUser':
      if (!isGroupUser(obj)) {
        handleTypeError();
      }
      return isGroupUser(obj);
    case 'GroupPermission':
      if (!isGroupPermission(obj)) {
        handleTypeError();
      }
      return isGroupPermission(obj);
    case 'Permission':
      if (!isPermission(obj)) {
        handleTypeError();
      }
      return isPermission(obj);
    case 'Message':
      if (!isMessage(obj)) {
        handleTypeError();
      }
      return isMessage(obj);
    case 'Conversation':
      if (!isConversation(obj)) {
        handleTypeError();
      }
      return isConversation(obj);
    case 'Notification':
      if (!isNotification(obj)) {
        handleTypeError();
      }
      return isNotification(obj);
  }
}

/**
 * A wrapper for isModelType that always either logs or throws an error.
 * @param obj The object to verify
 * @param modelType The type to check against
 * @param throwError (default: false) If true an error will be thrown, if false the error will only be logged
 */
export function verifyModelType<T>(obj: any, modelType: ModelType, throwError = false): obj is T {
  return isModelType<T>(obj, modelType, true, throwError);
}

/**
 * A wrapper for verifyModelType that always throws an error.
 * @param obj The object to verify
 * @param modelType The type to check against
 */
export function assertModelType<T>(obj: any, modelType: ModelType): obj is T {
  return verifyModelType<T>(obj, modelType, true);
}

/**
 * Same as isModelType but for an array of objects
 * @param obj The array of objects to verify
 * @param modelType The type to check against
 * @param verify (default: false) If true, an error will be logged or thrown if the variable is not the given type.
 * @param throwError (default: false) If true an error will be thrown, if false the error will only be logged
 */
export function isModelArrayType<T>(
  obj: any[],
  modelType: ModelType,
  verify = false,
  throwError = false
): obj is T[] {
  if (isArray(obj) && obj.length === 0) {
    return true;
  }
  return obj !== undefined && isModelType<T>(obj[0], modelType, verify, throwError);
}

/**
 * Same as verifyModelType but for an array of objects
 * @param obj The array of objects to verify
 * @param modelType The type to check against
 * @param throwError (default: false) If true an error will be thrown, if false the error will only be logged
 */
export function verifyModelArrayType<T>(
  obj: any[],
  modelType: ModelType,
  throwError = false
): obj is T[] {
  if (isArray(obj) && obj.length === 0) {
    return true;
  }
  return obj !== undefined && verifyModelType<T>(obj[0], modelType, throwError);
}

/**
 * Same as assertModelType but for an array of objects
 * @param obj The array of objects to verify
 * @param modelType The type to check against
 */
export function assertModelArrayType<T>(obj: any[] | undefined, modelType: ModelType): obj is T[] {
  if (isArray(obj) && obj.length === 0) {
    return true;
  }
  return obj !== undefined && assertModelType<T>(obj[0], modelType);
}
