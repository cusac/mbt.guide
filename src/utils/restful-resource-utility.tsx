import { HttpClient } from '../services/http-client.service';

export type Logger = typeof console;

// TODO: Fill out params
export type Params = {
  [key: string]: any;
  $embed?: string | string[];
  $skip?: number;
  $page?: number;
  $limit?: number;
  $sort?: string | string[];
  $text?: string;
};

export type ListResponse<T> = {
  data: {
    docs: T[];
    pages: {
      current: number;
      prev: number;
      hasPrev: boolean;
      next: number;
      hasNext: boolean;
      total: number;
    };
    items: {
      limit: number;
      begin: number;
      end: number;
      total: number;
    };
  };
};

export type Crud<T> = {
  list: (params: Params) => Promise<ListResponse<T>>;
  find: (_id: string, params: Params) => Promise<T>;
  update: (_id: string, payload: any) => Promise<T>;
  create: (payload: any | [any]) => Promise<T>;
  deleteOne: (_id: string, hardDelete: boolean) => Promise<any>;
  deleteMany: (payload: [any]) => Promise<any>;
};

export type Association<T> = {
  get: (ownerId: string, params: Params) => Promise<ListResponse<T>>;
  addOne: (ownerId: string, childId: string, payload: any) => Promise<any>;
  removeOne: (ownerId: string, childId: string) => Promise<any>;
  addMany: (ownerId: string, payload: [any]) => Promise<any>;
  removeMany: (ownerId: string, payload: [any]) => Promise<any>;
};

// For info on rest-hapi endpoints see: https://resthapi.com/
const ResourceHelper = function(httpClient: HttpClient, logger: Logger) {
  return {
    /**
     * Generate the CRUD methods for a resource.
     * @param resourceRoute: The API route for the resource.
     * @param options: Additional options to customize the caller.
     */
    generateCrudCallers: function(resourceRoute: string, options: any): Crud<any> {
      options = options || {};
      return {
        list: this.generateListCaller(resourceRoute, options),
        find: this.generateFindCaller(resourceRoute, options),
        update: this.generateUpdateCaller(resourceRoute, options),
        create: this.generateCreateCaller(resourceRoute, options),
        deleteOne: this.generateDeleteOneCaller(resourceRoute, options),
        deleteMany: this.generateDeleteManyCaller(resourceRoute, options),
      };
    },
    generateListCaller: function(resourceRoute: string, options: any) {
      return function(params: Params) {
        logger.debug(resourceRoute + '.list + params: ', params);

        if (!params) {
          params = { isDeleted: false };
        } else if (!params.isDeleted) {
          params.isDeleted = false;
        }

        if (options.filterDeleted === false) {
          delete params.isDeleted;
        }

        return httpClient
          .get(resourceRoute, params)
          .then(function(response) {
            logger.debug(resourceRoute + '.list response:\n', response);
            return response;
          })
          .catch(function(error) {
            logger.error(resourceRoute + '.list error:\n', error);
            throw error;
          });
      };
    },
    generateFindCaller: function(resourceRoute: string, options: any) {
      return function(_id: string, params: Params) {
        logger.debug(resourceRoute + '.find + _id: ', _id, ', params: ', params);

        return httpClient
          .get(resourceRoute + '/' + _id, params)
          .then(function(response) {
            logger.debug(resourceRoute + '.find response:\n', response);
            return response;
          })
          .catch(function(error) {
            logger.error(resourceRoute + '.find error:\n', error);
            throw error;
          });
      };
    },
    generateUpdateCaller: function(resourceRoute: string, options: any) {
      return function(_id: string, payload: any) {
        delete payload.createdAt;
        delete payload.updatedAt;
        delete payload.isDeleted;
        logger.debug(resourceRoute + '.update + _id: ', _id, ', payload: ', payload);

        return httpClient
          .put(resourceRoute + '/' + _id, payload)
          .then(function(response) {
            logger.debug(resourceRoute + '.update response:\n', response);
            return response;
          })
          .catch(function(error) {
            logger.error(resourceRoute + '.update error:\n', error);
            throw error;
          });
      };
    },
    generateCreateCaller: function(resourceRoute: string, options: any) {
      return function(payload: any) {
        logger.debug(resourceRoute + '.create + payload: ', payload);

        return httpClient
          .post(resourceRoute, payload)
          .then(function(response) {
            logger.debug(resourceRoute + '.create response:\n', response);
            return response;
          })
          .catch(function(error) {
            logger.error(resourceRoute + '.create error:\n', error);
            throw error;
          });
      };
    },
    generateDeleteOneCaller: function(resourceRoute: string, options: any) {
      return function(_id: string, hardDelete: boolean) {
        hardDelete = hardDelete || false;
        logger.debug(resourceRoute + '.deleteOne + _id: ', _id, ', hardDelete: ', hardDelete);

        return httpClient
          .delete(resourceRoute + '/' + _id, { hardDelete: hardDelete })
          .then(function(response) {
            logger.debug(resourceRoute + '.delete response:\n', response);
            return response;
          })
          .catch(function(error) {
            logger.debug(resourceRoute + '.delete error:\n', error);
            throw error;
          });
      };
    },
    generateDeleteManyCaller: function(resourceRoute: string, options: any) {
      return function(payload: any) {
        logger.debug(resourceRoute + '.deleteMany + payload', payload);

        return httpClient
          .delete(resourceRoute, payload)
          .then(function(response) {
            logger.debug(resourceRoute + '.delete response:\n', response);
            return response;
          })
          .catch(function(error) {
            logger.debug(resourceRoute + '.delete error:\n', error);
            throw error;
          });
      };
    },
    /**
     * Generate the association methods for a resource. The parameters are explained below with examples
     * using the context of a user and their shopping cart items.
     * @param ownerRoute: The API route for the owner resource,                    Ex: user
     * @param associationName: The name of the association for the owner resource, Ex: shoppingCartItems
     * @param associationRoute: The API route for the association,                 Ex: cart-item
     * childName: The name of the child/association resource,                      Ex: storeItem
     * @param options: Additional options to customize the caller.                Ex: cart-item
     *
     * The generated methods will correspond with the following routes:
     *
     * DELETE /user/{ownerId}/cart-item             Remove multiple storeItems from a user's list of shoppingCartItems
     * GET /user/{ownerId}/cart-item                Get all of the storeItems for a user
     * POST /user/{ownerId}/cart-item               Add multiple storeItems to a user's list of shoppingCartItems
     * DELETE /user/{ownerId}/cart-item/{childId}   Remove a single storeItem from a user's list of shoppingCartItems
     * PUT /user/{ownerId}/cart-item/{childId}      Add a single storeItem to a user's list of shoppingCartItems
     */
    generateAssociationCallers: function(
      ownerRoute: string,
      associationName: string,
      associationRoute: string,
      options: any
    ) {
      options = options || ({} as any);
      const resourceMethodName = associationName[0].toUpperCase() + associationName.slice(1);
      const callers = {
        [associationName]: {},
      } as any;
      callers[associationName]['get'] = this.generateGetAssociationsAssociationCaller(
        ownerRoute,
        associationRoute,
        resourceMethodName,
        options
      );
      callers[associationName]['addOne'] = this.generateAddOneAssociationCaller(
        ownerRoute,
        associationRoute,
        resourceMethodName,
        options
      );
      callers[associationName]['removeOne'] = this.generateRemoveOneAssociationCaller(
        ownerRoute,
        associationRoute,
        resourceMethodName,
        options
      );
      callers[associationName]['addMany'] = this.generateAddManyAssociationCaller(
        ownerRoute,
        associationRoute,
        resourceMethodName,
        options
      );
      callers[associationName]['removeMany'] = this.generateRemoveManyAssociationCaller(
        ownerRoute,
        associationRoute,
        resourceMethodName,
        options
      );

      return callers;
    },
    generateGetAssociationsAssociationCaller: function(
      ownerRoute: string,
      associationRoute: string,
      resourceMethodName: string,
      options: any
    ) {
      return function(ownerId: string, params: Params) {
        var methodName = ownerRoute + '.get' + resourceMethodName;
        logger.debug(methodName + ' + ownerId: ', ownerId, ', params: ', params);

        if (!params) {
          params = { isDeleted: false };
        } else if (!params.isDeleted) {
          params.isDeleted = false;
        }

        if (options.filterDeleted === false) {
          delete params.isDeleted;
        }

        return httpClient
          .get(ownerRoute + '/' + ownerId + '/' + associationRoute, params)
          .then(function(response) {
            logger.debug(methodName + ' response:\n', response);
            return response;
          })
          .catch(function(error) {
            logger.error(methodName + ' error:\n', error);
            throw error;
          });
      };
    },
    generateAddOneAssociationCaller: function(
      ownerRoute: string,
      associationRoute: string,
      resourceMethodName: string,
      options: any
    ) {
      return function(ownerId: string, childId: string, payload: any) {
        var methodName = ownerRoute + '.addOne' + resourceMethodName;
        logger.debug(
          methodName + ' + ownerId: ',
          ownerId,
          'childId: ',
          childId,
          ', payload: ',
          payload
        );

        return httpClient
          .put(ownerRoute + '/' + ownerId + '/' + associationRoute + '/' + childId, payload)
          .then(function(response) {
            logger.debug(methodName + ' response:\n', response);
            return response;
          })
          .catch(function(error) {
            logger.error(methodName + ' error:\n', error);
            throw error;
          });
      };
    },
    generateRemoveOneAssociationCaller: function(
      ownerRoute: string,
      associationRoute: string,
      resourceMethodName: string,
      options: any
    ) {
      return function(ownerId: string, childId: string) {
        var methodName = ownerRoute + '.removeOne' + resourceMethodName;
        logger.debug(
          methodName + ' + ownerId: ',
          ownerId,
          'childResource: ',
          associationRoute,
          'childId: ',
          childId
        );

        return httpClient
          .delete(ownerRoute + '/' + ownerId + '/' + associationRoute + '/' + childId)
          .then(function(response) {
            logger.debug(methodName + ' response:\n', response);
            return response;
          })
          .catch(function(error) {
            logger.error(methodName + ' error:\n', error);
            throw error;
          });
      };
    },
    generateAddManyAssociationCaller: function(
      ownerRoute: string,
      associationRoute: string,
      resourceMethodName: string,
      options: any
    ) {
      return function(ownerId: string, payload: any) {
        var methodName = ownerRoute + '.addMany' + resourceMethodName;
        logger.debug(methodName + ' + ownerId: ', ownerId, ', payload: ', payload);

        return httpClient
          .post(ownerRoute + '/' + ownerId + '/' + associationRoute, payload)
          .then(function(response) {
            logger.debug(methodName + ' response:\n', response);
            return response;
          })
          .catch(function(error) {
            logger.error(methodName + ' error:\n', error);
            throw error;
          });
      };
    },
    generateRemoveManyAssociationCaller: function(
      ownerRoute: string,
      associationRoute: string,
      resourceMethodName: string,
      options: any
    ) {
      return function(ownerId: string, payload: any) {
        var methodName = ownerRoute + '.removeMany' + resourceMethodName;
        logger.debug(methodName + ' + ownerId: ', ownerId, ', payload: ', payload);

        return httpClient
          .delete(ownerRoute + '/' + ownerId + '/' + associationRoute, payload)
          .then(function(response) {
            logger.debug(methodName + ' response:\n', response);
            return response;
          })
          .catch(function(error) {
            logger.error(methodName + ' error:\n', error);
            throw error;
          });
      };
    },
  };
};

export default ResourceHelper;
