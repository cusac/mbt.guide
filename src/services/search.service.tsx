import { httpClient as http } from '../services';
import { captureAndLog } from '../utils';

const internals = {} as any;

internals.searchSegments = (term: string) => {
  try {
    return http.get('/search/segments', { term });
  } catch (err) {
    captureAndLog('searchService', ' searchSegments', err);
    throw err;
  }
};

export default internals;
