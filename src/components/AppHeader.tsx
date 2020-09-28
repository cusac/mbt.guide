import React, { useGlobal } from 'reactn';
import * as utils from '../utils';
import * as components from '../components';
import * as serv from '../services';
import * as store from '../store';
import { toastError } from '../utils';
import logo from './logo-wide.png';
import { SearchType } from './Searchbar';

const { Button, Grid, Searchbar, Icon, Auth, Header, Menu } = components;

const services = serv as any;

const AppHeader = ({
  onHandleSubmit,
  showSearchbar,
  currentVideoId,
  currentSegmentId,
  searchType,
}: {
  onHandleSubmit: (arg0: string) => void;
  showSearchbar: boolean;
  currentVideoId: string;
  currentSegmentId: string;
  searchType: SearchType;
}): any => {
  const [loading, setLoading] = React.useState(false);
  const [currentUser] = (useGlobal as any)('user');
  const [previousView] = (useGlobal as any)('previousView');

  const logout = () => {
    try {
      services.auth.logout();
    } catch (err) {
      toastError('There was an error logging out.', err);
    }
  };

  const defaultSegmentId = '156b09ce-7dab-417a-8295-f6f86f1f504a';

  const activeTab = previousView ? previousView : searchType;

  const backText = previousView === 'video' ? 'Back To Video Search' : 'Back To Segment Search';

  const backToPreviousView = () => {
    if (previousView === 'video') {
      utils.history.push(`/${currentVideoId}`);
    } else {
      utils.history.push(`/search/${currentSegmentId}`);
    }
  };

  return (
    <Grid className="AppHeader">
      <Grid.Row style={{ paddingBottom: 0 }}>
        <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={4}>
          <img
            src={logo}
            className="logo"
            alt="My Big TOE guide"
            onClick={() => utils.history.push(`/`)}
          />
        </Grid.Column>

        <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={8}>
          {showSearchbar && <Searchbar onHandleSubmit={onHandleSubmit} searchType={searchType} />}
          {!showSearchbar && (
            <Button onClick={() => backToPreviousView()}>
              <Icon name="arrow left" />
              {backText}
            </Button>
          )}
        </Grid.Column>

        {!loading ? (
          <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={4}>
            {currentUser ? (
              <div>
                {currentUser.email}
                <br />
                <Button onClick={() => logout()} style={{ margin: 5 }}>
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
      <Grid.Row centered columns={1} style={{ paddingTop: 0 }}>
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
      </Grid.Row>
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
