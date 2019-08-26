// @flow

import axios from 'axios';
const KEY = 'AIzaSyAFUNYmE1gfydRFrlb3Q05gXlPSgQmiY6I';

export default axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  params: {
    part: 'snippet',
    maxResults: 50,
    key: KEY,
    channelId: 'UCYwlraEwuFB4ZqASowjoM0g',
  },
});
