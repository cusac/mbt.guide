// @flow
import { httpClient as http } from '../services';
import { captureAndLog } from 'utils';

export default async function({ endpoint, params }: { endpoint: string, params: any }) {
  try {
    const response = await http.post('/youtube', { endpoint, params });
    return response.data ? response.data.items : [];
  } catch (err) {
    captureAndLog('youtubeService', '', err);
    throw err;
  }
}
