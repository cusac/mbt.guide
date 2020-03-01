// @flow

import { httpClient as http } from '../services';

const internals = {};

internals.postVisit = () => {
  return http.post('/visitor');
};

export default internals;
