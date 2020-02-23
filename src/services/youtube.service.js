// @flow
import { httpClient as http } from '../services';

export default async function({ endpoint, params }: { endpoint: string, params: any }) {
  try {
    const response = await http.post('/youtube', { endpoint, params });
    return response.data ? response.data.items : [];
  } catch (err) {
    console.error('youtubeService-error:\n', err);
    throw err;
  }
}
