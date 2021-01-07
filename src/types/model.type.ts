/**
 * This file mostly provides typeguard functions to help verify the different model types.
 */

import { isArray } from 'lodash';
import { v4 as uuid } from 'uuid';
import captureAndLog from '../utils/captureAndLog';
import {
  isGroup,
  isGroupPermission,
  isGroupUser,
  isPermission,
  isRole,
  isRolePermission,
  isRoleUser,
  isSegment,
  isSegmentTag,
  isUser,
  isUserGroup,
  isUserPermission,
  isVideo,
  isVideoSegment,
} from './index';

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
  | 'Video'
  | 'VideoSegment'
  | 'Segment'
  | 'SegmentTag'
  | 'Tag';

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
  //@ts-ignore
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
    case 'Video':
      if (!isVideo(obj)) {
        handleTypeError();
      }
      return isVideo(obj);
    case 'VideoSegment':
      if (!isVideoSegment(obj)) {
        handleTypeError();
      }
      return isVideoSegment(obj);
    case 'Segment':
      if (!isSegment(obj)) {
        handleTypeError();
      }
      return isSegment(obj);
    case 'SegmentTag':
      if (!isSegmentTag(obj)) {
        handleTypeError();
      }
      return isSegmentTag(obj);
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
