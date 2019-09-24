// @flow

// const KEY = 'AIzaSyBTOgZacvh2HpWGO-8Fbd7dUOvMJvf-l_o';
const key = 'AIzaSyCaOgq4IfzE_5JrLFqyKCdigruqiSOz2q4';
const channelId = 'UCYwlraEwuFB4ZqASowjoM0g';

export default async function({ endpoint, params }: { endpoint: string, params: any }) {
  let url = `https://www.googleapis.com/youtube/v3/${endpoint}`;
  params = Object.assign(
    {
      part: 'snippet',
      maxResults: 50,
      key,
      channelId,
    },
    params
  );

  let first = true;

  for (const paramKey in params) {
    if (params[paramKey]) {
      url = first
        ? `${url}?${paramKey}=${params[paramKey]}`
        : `${url}&${paramKey}=${params[paramKey]}`;
      first = false;
    }
  }
  const response = await fetch(url);
  return (await response.json()).items;
}
