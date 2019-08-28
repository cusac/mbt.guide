// @flow

import * as React from 'react';
import * as utils from 'utils';
import * as components from 'components';
import * as services from 'services';
import Auth from '../routes/Home/Auth';

import logo from './logo-wide.png';

const { Button, Grid, Searchbar } = components;

const AppHeader = ({
  onHandleSubmit,
  showSearchbar,
}: {
  onHandleSubmit: string => void,
  showSearchbar: boolean,
}) => {
  const user = services.auth.currentUser;

  const goHome = () => {
    console.log('HEAD CLICKED');
    utils.history.push(`/`);
  };

  return (
    <Grid>
      {/* Header */}
      <Grid.Row>
        <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={4}>
          <img src={logo} className="logo" alt="My Big TOE guide" onClick={goHome} />
        </Grid.Column>

        <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={8}>
          {showSearchbar && <Searchbar onHandleSubmit={onHandleSubmit} />}
        </Grid.Column>

        <Grid.Column verticalAlign="middle" width={4}>
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
};

export default AppHeader;
