import { httpClient as http } from '../services';
import { captureAndLog } from '../utils';

const internals = {} as any;

internals.postVisit = () => {
  try {
    return http.post('/visitor');
  } catch (err) {
    captureAndLog({ file: 'statsService', method: 'postVisit', err });
    throw err;
  }
};

internals.logStats = () => {
  try {
    return http.post('/stats/video');
  } catch (err) {
    captureAndLog({ file: 'statsService', method: 'logStats', err });
    throw err;
  }
};

export default internals;
