import { httpClient as http } from '../services';
import { captureAndLog } from 'utils';

const internals = {};

internals.postVisit = () => {
  try {
    return http.post('/visitor');
  } catch (err) {
    captureAndLog('statsService', 'postVisit', err);
    throw err;
  }
};

internals.logStats = () => {
  try {
    return http.post('/stats/video');
  } catch (err) {
    captureAndLog('statsService', 'logStats', err);
    throw err;
  }
};

export default internals;
