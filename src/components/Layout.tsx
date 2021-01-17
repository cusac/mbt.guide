import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { AppHeader, Menu, Icon, Sticky } from '../components';
import logo from './logo-wide.png';
import { RootState } from 'store';
import { history } from 'utils';

const Layout = ({ children }: { children: any }) => {
  const [contextRef, setContextRef] = React.useState(undefined);

  const lastViewedSegmentId = useSelector((state: RootState) => state.video.lastViewedSegmentId);
  const lastViewedVideoId = useSelector((state: RootState) => state.video.lastViewedVideoId);

  return (
    <div className="ui two grid" ref={setContextRef as any}>
      <div
        className="column"
        style={{ flex: '0 0 300px', paddingRight: 0, backgroundColor: 'rgba(0, 0, 0, 0.87)' }}
      >
        <Sticky context={contextRef}>
          <Menu icon="labeled" fluid pointing inverted vertical>
            <Menu.Item as="a">
              <img
                src={logo}
                className="logo"
                alt="My Big TOE guide"
                // onClick={() => utils.history.push(`/`)}
              />
            </Menu.Item>
            <Menu.Item as="a" onClick={() => history.push(`/search/${lastViewedSegmentId}`)}>
              <Icon name="video" />
              Segments
            </Menu.Item>
            <Menu.Item as="a" onClick={() => history.push(`/${lastViewedVideoId}`)}>
              <Icon name="film" />
              Videos
            </Menu.Item>
            <Menu.Item as="a">
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8} floated="right">
                    <Grid.Row>
                      <Icon name="chart line" size="big" />
                    </Grid.Row>

                    <Grid.Row>Stats App</Grid.Row>
                  </Grid.Column>
                  <Grid.Column width={4} verticalAlign="middle">
                    <Icon name="external" />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Menu.Item>
          </Menu>
        </Sticky>
      </div>
      <div className="column" style={{ flex: 1 }}>
        <AppHeader />
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
