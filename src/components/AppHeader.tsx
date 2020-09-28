import React, { useGlobal } from 'reactn';
import * as utils from '../utils';
import * as components from '../components';
import * as serv from '../services';
import * as store from '../store';
import { toastError } from '../utils';
import logo from './logo-wide.png';
import { SearchType } from './Searchbar';

const { Button, Grid, Searchbar, Icon, Auth, Header } = components;

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

  const logout = () => {
    try {
      services.auth.logout();
    } catch (err) {
      toastError('There was an error logging out.', err);
    }
  };

  return (
    <Grid className="AppHeader">
      <Grid.Row>
        <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={4}>
          <img
            src={logo}
            className="logo"
            alt="My Big TOE guide"
            onClick={() => utils.history.push(`/`)}
          />
        </Grid.Column>

        <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={6}>
          {showSearchbar && <Searchbar onHandleSubmit={onHandleSubmit} searchType={searchType} />}
          {!showSearchbar && (
            <Button onClick={() => utils.history.push(`/${currentVideoId}`)}>
              <Icon name="arrow left" />
              Back To Home
            </Button>
          )}
        </Grid.Column>

        <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={2}>
          {searchType === 'video' && (
            <Button onClick={() => utils.history.push(`/search/${currentSegmentId}`)}>
              <Icon name="search" />
              Search Segments
            </Button>
          )}
          {searchType === 'segment' && (
            <Button onClick={() => utils.history.push(`/${currentVideoId}`)}>
              <Icon name="search" />
              Search Videos
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
    </Grid>
  );
};

AppHeader.defaultProps = {
  showSearchbar: false,
  onHandleSubmit: () => {},
  currentVideoId: '',
  currentSegmentId: '',
  searchType: 'video',
};

export default AppHeader;
