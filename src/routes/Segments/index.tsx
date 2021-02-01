import React from 'react';
import { useSelector } from 'react-redux';
import ResizeObserver from 'resize-observer-polyfill';
import {
  RootState,
  setLastViewedSegmentId,
  setLoadingSegments,
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

const { Grid, SegmentList, Loading } = components;

const Segments = ({ segmentId }: { segmentId: string }) => {
  const [error, setError] = React.useState();
  const [loadingSelectedSegment, setLoadingSelectedSegment] = React.useState(true);
  const [segments, setSegments] = React.useState(undefined as Array<any> | void);
  const [selectedSegment, setSelectedSegment] = React.useState();
  const [videoColumnRef, setVideoColumnRef] = React.useState(
    undefined as HTMLDivElement | undefined
  );
  const [columnHeight, setColumnHeight] = React.useState(1024);

  const lastViewedSegmentId = useSelector((state: RootState) => state.video.lastViewedSegmentId);
  const loadingSegments = useSelector((state: RootState) => state.video.loadingSegments);
  const searchSegmentsResult = useSelector((state: RootState) => state.video.searchSegmentsResult);

  const dispatch = useAppDispatch();

  const selectSegment = async (selectSegmentId: string) => {
    dispatch(setLastViewedSegmentId({ lastViewedSegmentId: selectSegmentId }));
    utils.history.push(`/segments/${selectSegmentId}`);
  };

  const videoColumnResizeObserver = new ResizeObserver(entries => {
    setColumnHeight(entries[0].target.clientHeight);
  });

  // Fetch the default list of segments from the most recent segments
  React.useEffect(() => {
    async function fetchSegments() {
      try {
        dispatch(setLoadingSegments({ loadingSegments: true }));

        const segments = (
          await (services as any).repository.segment.list({
            $embed: ['video', 'tags'],
            $limit: 50,
          })
        ).data.docs;

        setSegments(segments);
      } catch (err) {
        captureAndLog({ file: 'Segments', method: 'fetchSegments', err });
        toastError(
          'There was an error fetching segment data. Please refresh the page and try again.',
          err
        );
      } finally {
        dispatch(setLoadingSegments({ loadingSegments: false }));
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

  React.useEffect(() => {
    if (videoColumnRef && videoColumnRef.clientHeight) {
      videoColumnResizeObserver.observe(videoColumnRef);
    }
  }, [videoColumnRef]);

  React.useEffect(() => {
    searchSegmentsResult && setSegments(searchSegmentsResult);
  }, [searchSegmentsResult]);

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
        captureAndLog({ file: 'Segments', method: 'fetchSelectedSegment', err });
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

  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column width={11}>
            {!loadingSelectedSegment ? (
              selectedSegment ? (
                <div ref={setVideoColumnRef as any}>
                  <SegmentViewer segment={selectedSegment} />
                </div>
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
                  <div style={{ overflow: 'auto', maxHeight: columnHeight }}>
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

export default Segments;
