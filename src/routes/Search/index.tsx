import React from 'react';
import { useSelector } from 'react-redux';
import {
  RootState,
  setLastViewedSegmentId,
  setPreviousView,
  setSearchType,
  setShowSearchbar,
  useAppDispatch,
} from 'store';
import * as components from '../../components';
import SegmentViewer from '../../components/SegmentViewer';
import * as services from '../../services';
import * as utils from '../../utils';
import { captureAndLog, toastError } from '../../utils';

const channelId = 'UCYwlraEwuFB4ZqASowjoM0g';

const {
  Button,
  Link,
  Grid,
  SegmentList,
  Header,
  Icon,
  Container,
  Divider,
  Loading,
  Checkbox,
  Card,
} = components;

const Search = ({ segmentId }: { segmentId: string }) => {
  const [error, setError] = React.useState();
  const [loadingSegments, setLoadingSegments] = React.useState(true);
  const [loadingSelectedSegment, setLoadingSelectedSegment] = React.useState(true);
  const [segments, setSegments] = React.useState(undefined as Array<any> | void);
  const [mySegments, setMySegments] = React.useState(undefined as Array<any> | void);
  const [selectedSegment, setSelectedSegment] = React.useState();
  const [segmentSegmentMap, setSegmentSegmentMap] = React.useState({});
  const [filterProcessedSegments, setFilterProcessedSegments] = React.useState(false);
  const [segmentSegment, setSegmentSegment] = React.useState();

  const lastViewedSegmentId = useSelector((state: RootState) => state.video.lastViewedSegmentId);

  const dispatch = useAppDispatch();

  const selectSegment = async (selectSegmentId: string) => {
    dispatch(setLastViewedSegmentId({ lastViewedSegmentId: selectSegmentId }));
    utils.history.push(`/search/${selectSegmentId}`);
  };

  // Fetch the default list of segments from the most recent segments
  React.useEffect(() => {
    async function fetchSegments() {
      try {
        setLoadingSegments(true);

        const segments = (
          await (services as any).repository.segment.list({
            $embed: ['video', 'tags'],
            $limit: 50,
          })
        ).data.docs;

        setSegments(segments);
      } catch (err) {
        captureAndLog({ file: 'Search', method: 'fetchSegments', err });
        toastError(
          'There was an error fetching segment data. Please refresh the page and try again.',
          err
        );
      } finally {
        setLoadingSegments(false);
      }
    }
    // Hardcode a default segment for now
    const currentSegmentId = segmentId ? segmentId : lastViewedSegmentId;
    !segmentId && selectSegment(currentSegmentId);
    dispatch(setPreviousView({ previousView: 'segment' }));
    dispatch(setSearchType({ searchType: 'segment' }));
    dispatch(setShowSearchbar({ showSearchbar: true }));
    dispatch(setLastViewedSegmentId({ lastViewedSegmentId: currentSegmentId }));
    fetchSegments();
  }, []);

  // Fetch the selected segment
  React.useEffect(() => {
    async function fetchSelectedSegment() {
      try {
        setLoadingSelectedSegment(true);

        const segment = (
          await (services as any).repository.segment.list({
            $embed: ['video', 'tags'],
            segmentId: segmentId,
          })
        ).data.docs[0];
        setSelectedSegment(segment);
      } catch (err) {
        setLoadingSelectedSegment(false);
        captureAndLog({ file: 'Search', method: 'fetchSelectedSegment', err });
        toastError(
          'There was an error fetching the selected segment. Please refresh the page and try again.',
          err
        );
      } finally {
        setLoadingSelectedSegment(false);
      }
    }
    segmentId && fetchSelectedSegment();
  }, [segmentId]);

  // React.useEffect(() => {
  //   setSegments(segmentSegment ? (segmentSegment as any).segments : []);
  // }, [segmentSegment]);

  // React.useEffect(() => {
  //   segments &&
  //     setMySegments(segments.filter(s => currentUser && s.ownerEmail === currentUser.email));
  // }, [segments, currentUser]);

  // const segmentSrc = selectedSegment
  //   ? `https://www.youtube.com/embed/${(selectedSegment as any).id.segmentId ||
  //       (selectedSegment as any).id}`
  //   : '';

  // Search segments
  const searchSegments = async (term: any) => {
    try {
      setLoadingSegments(true);
      const segments = (await services.search.searchSegments(term)).data;

      setSegments(segments);
    } catch (err) {
      captureAndLog({ file: 'Search', method: 'searchSegments', err });
      toastError(
        'There was an error fetching segment data. Please refresh the page and try again.',
        err
      );
    } finally {
      setLoadingSegments(false);
    }
  };

  return (
    <div style={{ height: 135 }}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={11}>
            {!loadingSelectedSegment ? (
              selectedSegment ? (
                <SegmentViewer segment={selectedSegment} />
              ) : (
                <h2 style={{ color: 'black' }}>Segment not found. </h2>
              )
            ) : (
              <Loading>Loading segment...</Loading>
            )}
          </Grid.Column>
          <Grid.Column style={{ color: 'white' }} verticalAlign="middle" width={4}>
            {!loadingSegments ? (
              <div>
                {segments && segments.length > 0 ? (
                  <div>
                    <SegmentList
                      segments={segments as any}
                      handleSegmentSelect={(segment: any) =>
                        segment && selectSegment(segment.segmentId)
                      }
                    />
                  </div>
                ) : (
                  <h2 style={{ color: 'black' }}>
                    No segments found. Try searching for something less specific or if searching for
                    a title make sure the title is exact.{' '}
                  </h2>
                )}
              </div>
            ) : (
              <Loading>Loading segments...</Loading>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Search;
