// @flow

import axios from 'axios';
import ResourceHelper, { type Logger } from '../utils/restful-resource-utility';
import { type HttpClient } from './http-client.service';
import { type Repository } from '../config';

// For info on rest-hapi endpoints see: https://resthapi.com/
const RestHapiRepository: $Shape<Repository> = {
  install({
    httpClient,
    resources,
    log,
  }: {
    httpClient: HttpClient,
    resources: any,
    log: boolean,
  }) {
    httpClient = httpClient || axios;

    const fakeLogger: Logger | any = {
      log: function() {},
      debug: function() {},
      error: function() {},
    };

    var logger = log ? console : fakeLogger;

    const resourceHelper = ResourceHelper(httpClient, logger);
    for (var resourceName in resources) {
      const resource = resources[resourceName];
      const resourceRoute = resource.alias || resourceName;
      var repoCalls = resourceHelper.generateCrudCallers(resourceRoute, resource.options);
      const associations = resource.associations;

      for (var associationName in associations) {
        const association = associations[associationName];
        const associationRoute = association.alias || associationName;
        repoCalls = Object.assign(
          {},
          repoCalls,
          resourceHelper.generateAssociationCallers(
            resourceRoute,
            associationName,
            associationRoute,
            association.options
          )
        );
      }

      const repoName = resourceName;
      this[repoName] = repoCalls;
    }
  },
};

export default RestHapiRepository;
