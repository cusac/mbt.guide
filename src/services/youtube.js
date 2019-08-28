// @flow

import axios from 'axios';
const KEY = 'AIzaSyBTOgZacvh2HpWGO-8Fbd7dUOvMJvf-l_o';

export default axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  params: {
    part: 'snippet',
    maxResults: 50,
    key: KEY,
    channelId: 'UCYwlraEwuFB4ZqASowjoM0g',
  },
});
