// @flow

import * as React from 'react';
import * as utils from 'utils';
import * as components from 'components';
import * as services from 'services';

import logo from './logo-wide.png';

const { Button, Grid, Searchbar, Icon, Auth } = components;

const AppHeader = ({
  onHandleSubmit,
  showSearchbar,
  currentVideoId,
}: {
  onHandleSubmit: string => void,
  showSearchbar: boolean,
  currentVideoId: string,
}) => {
  const user = services.auth.currentUser;

  return (
    <Grid className="AppHeader">
      <Grid.Row>
        <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={4}>
          <img
            src={logo}
            className="logo"
            alt="My Big TOE guide"
            onClick={() => utils.history.push(`/${currentVideoId}`)}
          />
        </Grid.Column>

        <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={8}>
          {showSearchbar && <Searchbar onHandleSubmit={onHandleSubmit} />}
          {!showSearchbar && (
            <Button onClick={() => utils.history.push(`/${currentVideoId}`)}>
              <Icon name="arrow left" />
              Back To Home
            </Button>
          )}
        </Grid.Column>

        <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={4}>
          {user ? (
            <div>
              {user.email}
              <br />
              <Button onClick={() => services.auth.signOut()} style={{ margin: 5 }}>
                Sign out
              </Button>
            </div>
          ) : (
            <Auth />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

AppHeader.defaultProps = {
  showSearchbar: false,
  onHandleSubmit: () => {},
  currentVideoId: '',
};

export default AppHeader;
