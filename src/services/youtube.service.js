// @flow

import axios from 'axios';
// const KEY = 'AIzaSyBTOgZacvh2HpWGO-8Fbd7dUOvMJvf-l_o';
const KEY = 'AIzaSyCaOgq4IfzE_5JrLFqyKCdigruqiSOz2q4';

export default axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  params: {
    part: 'snippet',
    maxResults: 50,
    key: KEY,
    channelId: 'UCYwlraEwuFB4ZqASowjoM0g',
  },
});
