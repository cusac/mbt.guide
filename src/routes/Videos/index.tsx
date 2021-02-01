import React from 'react';
import { useSelector } from 'react-redux';
import ResizeObserver from 'resize-observer-polyfill';
import {
  RootState,
  setHasSearched,
  setLastViewedVideoId,
  setLoadingVideos,
  setPreviousView,
  setSearchType,
  setShowSearchbar,
  useAppDispatch,
} from 'store';
import { PlaylistYTVideo, Segment, Video, VideoListYTVideo, YTResult, YTVideo } from 'types';
import * as components from '../../components';
import * as services from '../../services';
import repository from '../../services/repository.service';
import { toYTVid, youtubeCall } from '../../services/youtube.service';
import { assertModelArrayType } from '../../types/model.type';
import * as utils from '../../utils';
import { captureAndLog, toastError } from '../../utils';
import { useState } from 'react';
import LandingPage from '../../components/LandingPage';

const {
  Button,
  Link,
  Grid,
  VideoList,
  Header,
  Icon,
  Container,
  Divider,
  Loading,
  Checkbox,
  Card,
} = components;

const Videos = ({ videoId }: { videoId: string }) => {
  const [error, setError] = React.useState();
  const [loadingSelectedVideo, setLoadingSelectedVideo] = React.useState(true);
  const [loadingSegments, setLoadingSegments] = React.useState(true);
  const [segments, setSegments] = React.useState(undefined as Segment[] | void);
  const [mySegments, setMySegments] = React.useState(undefined as Array<Segment> | void);
  const [selectedVideo, setSelectedVideo] = React.useState(undefined as YTVideo | undefined);
  const [videos, setVideos] = React.useState([] as YTVideo[]);
  const [filterProcessedVideos, setFilterProcessedVideos] = React.useState(true);
  const [segmentVideo, setSegmentVideo] = React.useState(undefined as Video | undefined);
  const [matchedVids, setMatchedVids] = React.useState([] as Video[]);
  const [videoColumnRef, setVideoColumnRef] = React.useState(
    undefined as HTMLDivElement | undefined
  );
  const [columnHeight, setColumnHeight] = React.useState(1024);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [readMore, setReadMore] = useState(false);
  const searchYTVideosResult = useSelector((state: RootState) => state.video.searchYTVideosResult);
  const hasSearched = useSelector((state: RootState) => state.video.hasSearched);
  const loadingVideos = useSelector((state: RootState) => state.video.loadingVideos);

  const dispatch = useAppDispatch();

  const selectVideo = async (videoId: any) => {
    dispatch(setLastViewedVideoId({ lastViewedVideoId: videoId }));
    utils.history.push(`/videos/${videoId}`);
  };

  const fetchDefaultVideos = async () => {
    try {
      dispatch(setLoadingVideos({ loadingVideos: true }));

      // We're piggybacking this view to update the stats for now
      await services.stats.logStats();

      let defaultVids: YTVideo[] = [];
      let pageToken = '';

      while (true) {
        const { nextPageToken, items } = await fetchPlaylistVids(pageToken);
        if (items.length === 0) {
          break;
        }
        pageToken = nextPageToken;

        const matchingVids = await fetchMatchingVideos(items);
        const filteredVids = filterProcessedVideos
          ? filterVidsWithSegments(items, matchingVids)
          : items;

        defaultVids = defaultVids.concat(filteredVids);

        if (defaultVids.length >= 10) {
          break;
        }
      }

      setVideos(defaultVids);
      !videoId && selectVideo(`_ok27SPHhwA`);
    } catch (err) {
      captureAndLog({ file: 'Home', method: 'fetchVideos', err });
      toastError(
        'There was an error fetching youtube data. Please refresh the page and try again.',
        err
      );
    } finally {
      dispatch(setLoadingVideos({ loadingVideos: false }));
    }
  };

  // We grab videos from the MBT 'uploads' playlist to save on youtube api search quota points
  const fetchPlaylistVids = async (pageToken?: string): Promise<YTResult<YTVideo>> => {
    const params: any = {
      playlistId: 'UUYwlraEwuFB4ZqASowjoM0g',
    };
    if (pageToken) {
      params.pageToken = pageToken;
    }
    const { data } = await youtubeCall<PlaylistYTVideo>({
      endpoint: 'playlistItems',
      params,
    });

    return { ...data, items: data.items.map(toYTVid) };
  };

  //TODO: TEST THIS
  const filterVidsWithSegments = (ytVids: YTVideo[], matchingVids: Video[]): YTVideo[] => {
    return ytVids.filter(ytVid => {
      const match = matchingVids.find(v => v.ytId === ytVid.id);
      if (!match) {
        return true;
      } else {
        if (match !== undefined && match.segments !== undefined) {
          return !match.segments[0];
        } else {
          return true;
        }
      }
    });
  };

  const fetchMatchingVideos = async (ytVideos: YTVideo[]): Promise<Video[]> => {
    const videoIds = ytVideos.map(v => v.id);
    const matchingVids = (
      await repository.video.list({
        ytId: videoIds,
        $select: ['ytId'],
        $embed: ['segments'],
      })
    ).data.docs;
    return matchingVids;
  };

  const videoColumnResizeObserver = new ResizeObserver(entries => {
    setColumnHeight(entries[0].target.clientHeight);
  });

  // Fetch the default list of videos from the MBT uploads list
  React.useEffect(() => {
    fetchDefaultVideos();
    dispatch(setPreviousView({ previousView: 'video' }));
    dispatch(setSearchType({ searchType: 'ytVideo' }));
    dispatch(setHasSearched({ hasSearched: false }));
    dispatch(setShowSearchbar({ showSearchbar: true }));
    dispatch(setLastViewedVideoId({ lastViewedVideoId: videoId }));
  }, []);

  React.useEffect(() => {
    if (videoColumnRef && videoColumnRef.clientHeight) {
      videoColumnResizeObserver.observe(videoColumnRef);
    }
  }, [videoColumnRef]);

  // Fetch playlist videos when filter is toggled
  React.useEffect(() => {
    !hasSearched && fetchDefaultVideos();
  }, [filterProcessedVideos]);

  // Filter search results when filter is toggled
  React.useEffect(() => {
    if (hasSearched) {
      if (filterProcessedVideos) {
        const filteredVids = filterVidsWithSegments(searchYTVideosResult, matchedVids);
        setVideos(filteredVids);
      } else {
        setVideos(searchYTVideosResult);
      }
    }
  }, [filterProcessedVideos]);

  // Fetch the selected video from youtube
  React.useEffect(() => {
    async function fetchSelectedVideo() {
      try {
        setLoadingSelectedVideo(true);
        const [video] = (
          await youtubeCall<VideoListYTVideo>({
            endpoint: 'videos',
            params: {
              id: videoId,
            },
          })
        ).data.items;
        setSelectedVideo(toYTVid(video));
      } catch (err) {
        setLoadingSelectedVideo(false);
        captureAndLog({ file: 'Home', method: 'fetchSelectedVideo', err });
        toastError(
          'There was an error fetching youtube data. Please refresh the page and try again.',
          err
        );
      } finally {
        setLoadingSelectedVideo(false);
      }
    }
    videoId && fetchSelectedVideo();
  }, [videoId]);

  // Get the segments for the selected video
  React.useEffect(() => {
    const fetchSegmentVideo = async () => {
      try {
        setLoadingSegments(true);
        const video = (
          await repository.video.list({
            ytId: videoId,
            $embed: ['segments'],
          })
        ).data.docs[0];
        video ? setSegmentVideo(video) : setSegments([]);
      } catch (err) {
        captureAndLog({ file: 'Home', method: 'fetchSegmentVideo', err });
        toastError(
          'There was an error fetching the selected video data. Please refresh the page and try again.',
          err
        );
      } finally {
        setLoadingSegments(false);
      }
    };
    videoId ? fetchSegmentVideo() : setSegments([]);
  }, [videoId]);

  React.useEffect(
    function extractSegmentsFromVideo() {
      try {
        const videoSegments = segmentVideo ? segmentVideo.segments : [];
        if (
          videoSegments !== undefined &&
          assertModelArrayType<Segment>(videoSegments, 'Segment')
        ) {
          setSegments(videoSegments);
        }
      } catch (err) {
        captureAndLog({ file: 'Home', method: 'extractSegmentsFromVideo', err });
        //TODO: THROW A TOAST
      }
    },
    [segmentVideo]
  );

  React.useEffect(() => {
    segments &&
      setMySegments(segments.filter(s => currentUser && s.ownerEmail === currentUser.email));
  }, [segments, currentUser]);

  React.useEffect(() => {
    const processSearchResults = async () => {
      const mbtVids = await fetchMatchingVideos(searchYTVideosResult);

      setMatchedVids(mbtVids);

      if (filterProcessedVideos) {
        const filteredVids = filterVidsWithSegments(searchYTVideosResult, mbtVids);
        setVideos(filteredVids);
      } else {
        setVideos(searchYTVideosResult);
      }
    };

    hasSearched && processSearchResults();
  }, [searchYTVideosResult]);

  const videoSrc = selectedVideo ? `https://www.youtube.com/embed/${selectedVideo.id}` : '';

  const createVideo = (event: any) => {
    event.preventDefault();
    utils.history.push(`/edit/${videoId}`);
  };

  const descText = selectedVideo ? selectedVideo.snippet.description : 'None';
  const descPreview = descText.substring(0, 150) + ' ...';
  const extraContent = (
    <div>
      <p className="extra-content">{descText}</p>
    </div>
  );

  const moreButtonName = readMore ? 'Collapse' : 'Read More';
  // TODO: Update landing page to default to general users
  // TODO: Make sure landing page does not override the default video (_ok27SPHhwA)
  const isLandingPage = selectedVideo ? selectedVideo.id === '_ok27SPHhwA' : false;
  let datePublished = selectedVideo ? selectedVideo.snippet.publishedAt.toString() : 'NA';
  datePublished = datePublished.replace('T', ' Time: ').replace('Z', '');

  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column style={{ marginLeft: 5 }} width={11}>
            {!loadingSelectedVideo ? (
              <div ref={setVideoColumnRef as any}>
                {selectedVideo ? (
                  isLandingPage ? (
                    <LandingPage />
                  ) : (
                    <div>
                      <div className="ui embed">
                        <iframe src={videoSrc} allowFullScreen title="Video player" />
                      </div>
                      <div className="videodesc">
                        <h3>{(selectedVideo as any).snippet.title}</h3>

                        <p>{'Date Published : ' + datePublished}</p>
                        <p>
                          {!readMore && descPreview}
                          {readMore && extraContent}
                          <Button
                            icon
                            labelPosition={readMore ? 'left' : 'right'}
                            color="teal"
                            floated="right"
                            size="mini"
                            onClick={() => {
                              setReadMore(!readMore);
                            }}
                          >
                            {moreButtonName}
                            <Icon className={readMore ? 'left arrow' : 'right arrow'} />
                          </Button>
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <div>Select a video</div>
                )}
                <br />
                {!isLandingPage && (
                  <Button
                    color="teal"
                    size="big"
                    onClick={() => utils.history.push(`/edit/${videoId}`)}
                  >
                    <Icon name="plus" /> New Segment
                  </Button>
                )}
                <br />
                {!loadingSegments && !isLandingPage ? (
                  <div>
                    {currentUser && (
                      <div>
                        <Divider horizontal>
                          <Header as="h2">
                            <Icon name="user" color="blue" />
                            <Header.Content>Your Segments</Header.Content>
                          </Header>
                        </Divider>
                        {mySegments && mySegments.length > 0 ? (
                          <Container>
                            <Grid celled="internally">
                              <Grid.Row>
                                <Grid.Column verticalAlign="middle" width={3}>
                                  <h4>Segment Title</h4>
                                </Grid.Column>
                                <Grid.Column width={9}>
                                  <h4>Description</h4>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                  <h4>Edit</h4>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                  <h4>Watch</h4>
                                </Grid.Column>
                              </Grid.Row>
                              {mySegments.map(segment => (
                                <Grid.Row key={(segment as any).segmentId}>
                                  <Grid.Column verticalAlign="middle" width={3}>
                                    <Link to={`/segments/${(segment as any).segmentId}`}>
                                      {(segment as any).title}
                                    </Link>
                                  </Grid.Column>
                                  <Grid.Column textAlign="left" width={9}>
                                    {(segment as any).description || 'No description available.'}
                                  </Grid.Column>
                                  <Grid.Column width={2}>
                                    <Icon
                                      link={true}
                                      style={{ marginLeft: 10 }}
                                      size="big"
                                      name="edit"
                                      color="blue"
                                      onClick={() =>
                                        utils.history.push(
                                          `/edit/${(segment as any).videoYtId}/${
                                            (segment as any).segmentId
                                          }`
                                        )
                                      }
                                    />
                                  </Grid.Column>
                                  <Grid.Column width={2}>
                                    <Icon
                                      link={true}
                                      size="big"
                                      name="video play"
                                      color="green"
                                      onClick={() =>
                                        utils.history.push(
                                          `/segments/${(segment as any).segmentId}`
                                        )
                                      }
                                    />
                                  </Grid.Column>
                                </Grid.Row>
                              ))}
                            </Grid>
                          </Container>
                        ) : (
                          selectedVideo && (
                            <div>
                              You don{"'"}t have any segments for this video.{' '}
                              <Link onClick={createVideo} to="">
                                Try adding one!
                              </Link>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    <Divider horizontal style={{ marginTop: 75 }}>
                      <Header as="h2">
                        <Icon name="video" color="green" />
                        <Header.Content>All Segments</Header.Content>
                      </Header>
                    </Divider>
                    {segments && segments.length > 0 ? (
                      <Container>
                        <Grid celled="internally">
                          <Grid.Row>
                            <Grid.Column verticalAlign="middle" width={3}>
                              <h4>Segment Title</h4>
                            </Grid.Column>
                            <Grid.Column width={11}>
                              <h4>Description</h4>
                            </Grid.Column>
                            <Grid.Column width={2}>
                              <h4>Watch</h4>
                            </Grid.Column>
                          </Grid.Row>
                          {segments.map(segment => (
                            <Grid.Row key={(segment as any).segmentId}>
                              <Grid.Column verticalAlign="middle" width={3}>
                                <Link to={`/segments/${(segment as any).segmentId}`}>
                                  {(segment as any).title}
                                </Link>
                              </Grid.Column>
                              <Grid.Column textAlign="left" width={11}>
                                {(segment as any).description || 'No description available.'}
                              </Grid.Column>
                              <Grid.Column width={2}>
                                <Icon
                                  link={true}
                                  size="big"
                                  name="video play"
                                  color="green"
                                  onClick={() =>
                                    utils.history.push(`/segments/${(segment as any).segmentId}`)
                                  }
                                />
                              </Grid.Column>
                            </Grid.Row>
                          ))}
                        </Grid>
                      </Container>
                    ) : (
                      selectedVideo && (
                        <div>
                          No segments for this video.{' '}
                          <Link onClick={createVideo} to="">
                            Add the first one!
                          </Link>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  !isLandingPage && <Loading>Loading segments...</Loading>
                )}
              </div>
            ) : (
              <Loading>Loading video...</Loading>
            )}
          </Grid.Column>
          <Grid.Column style={{ color: 'white' }} verticalAlign="top" width={4}>
            {!loadingVideos ? (
              <div>
                {videos && videos.length > 0 ? (
                  <div>
                    <Card fluid color="blue">
                      <Card.Content>
                        <Card.Header>
                          <Checkbox
                            toggle
                            label="Hide Processed Videos"
                            checked={filterProcessedVideos}
                            onChange={(event, data) =>
                              setFilterProcessedVideos((data as any).checked)
                            }
                          />
                        </Card.Header>
                      </Card.Content>
                    </Card>
                    <div style={{ overflow: 'auto', maxHeight: columnHeight }}>
                      <VideoList
                        videos={videos as any}
                        handleVideoSelect={(video: YTVideo) => video && selectVideo(video.id)}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 style={{ color: 'black' }}>No videos found. </h2>
                    <h3 style={{ color: 'grey' }}>
                      Try searching for something less specific or if searching for a title make
                      sure the title is exact. Try unchecking the Hide Processed Videos checkbox.{' '}
                    </h3>
                  </div>
                )}
              </div>
            ) : (
              <Loading>Loading videos...</Loading>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Videos;
