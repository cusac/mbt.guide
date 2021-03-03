import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, RootState } from 'store';
import * as components from '../components';
import * as utils from '../utils';
import { toastError } from '../utils';

const { Button, Grid, Searchbar, Icon, Auth, Header, Menu } = components;

const AppHeader = (): any => {
  const [loading, setLoading] = React.useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const previousView = useSelector((state: RootState) => state.main.previousView);
  const searchType = useSelector((state: RootState) => state.video.searchType);
  const showSearchbar = useSelector((state: RootState) => state.main.showSearchbar);
  const lastViewedSegmentId = useSelector((state: RootState) => state.video.lastViewedSegmentId);
  const lastViewedVideoId = useSelector((state: RootState) => state.video.lastViewedVideoId);

  const dispatch = useDispatch();

  const logoutClick = async () => {
    try {
      await dispatch(logout());
    } catch (err) {
      toastError('There was an error logging out.', err);
    }
  };

  const defaultSegmentId = '156b09ce-7dab-417a-8295-f6f86f1f504a';

  const activeTab = previousView ? previousView : searchType;

  const backText = previousView === 'video' ? 'Back To Video Search' : 'Back To Segment Search';

  const backToPreviousView = () => {
    if (previousView === 'video') {
      utils.history.push(`/videos/${lastViewedVideoId}`);
    } else {
      utils.history.push(`/segments/${lastViewedSegmentId}`);
    }
  };

  return (
    <Grid className="AppHeader">
      <Grid.Row style={{ paddingBottom: 0 }}>
        {/* <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={4}>
          <Image
            src={logo}
            className="logo"
            alt="My Big TOE guide"
            //onClick={() => utils.history.push(`/`)}
            href="https://mbt-guide.netlify.app/"
          />
        </Grid.Column> */}

        <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" floated="right" width={8}>
          {showSearchbar && <Searchbar />}
          {!showSearchbar && (
            <Button onClick={() => backToPreviousView()}>
              <Icon name="arrow left" />
              {backText}
            </Button>
          )}
        </Grid.Column>

        {!loading ? (
          <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={6}>
            {currentUser ? (
              <div>
                {'Welcome ' + currentUser.firstName + ' ' + currentUser.lastName + ' !'}
                <br />
                {currentUser.email}
                <br />
                <Button onClick={() => logoutClick()} style={{ margin: 10 }}>
                  Sign out
                </Button>
              </div>
            ) : (
              <Auth setLoading={setLoading} />
            )}
          </Grid.Column>
        ) : (
          <Header as="h2" icon textAlign="center" style={{ color: 'white ' }}>
            <Icon loading name="spinner" />
            <Header.Content>Signing In...</Header.Content>
          </Header>
        )}
      </Grid.Row>
      {/* <Grid.Row columns={3} style={{ paddingTop: 0 }}>
        <Grid.Column style={{ color: 'white' }} width={6}></Grid.Column>
        <Grid.Column style={{ color: 'white' }} width={4}>
          <Menu fluid widths={2} inverted>
            <Menu.Item
              name="video"
              active={activeTab === 'video'}
              onClick={() => activeTab === 'segment' && utils.history.push(`/${currentVideoId}`)}
            >
              Video Search
            </Menu.Item>

            <Menu.Item
              name="segment"
              active={activeTab === 'segment'}
              // TODO: Find a way to better handle the hardcoded default segment
              onClick={() =>
                activeTab === 'video' &&
                utils.history.push(`/search/${currentSegmentId || defaultSegmentId}`)
              }
            >
              Segment Search
            </Menu.Item>
          </Menu>
        </Grid.Column>

        <Grid.Column style={{ color: 'white' }} width={4} floated="right">
          <a href="https://mbt-guide-admin.netlify.app/" target="_blank" rel="noopener noreferrer">
            <Button style={{ margin: 5 }} icon labelPosition="right" color="teal">
              View Stats App <Icon name="chart line" />
            </Button>
          </a>
        </Grid.Column>
      </Grid.Row> */}
    </Grid>
  );
};

AppHeader.defaultProps = {
  showSearchbar: false,
  onHandleSubmit: () => undefined,
  currentVideoId: '',
  currentSegmentId: '',
  searchType: 'video',
};

export default AppHeader;
