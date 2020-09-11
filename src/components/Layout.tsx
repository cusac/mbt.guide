import React from 'react';
import { AppHeader, Menu, Icon, Sticky } from 'components';
import logo from './logo-wide.png';

const Layout = ({ children }: { children: any }) => {
  const [contextRef, setContextRef] = React.useState(undefined);

  return (
    <div className="ui two grid" ref={setContextRef}>
      <div className="column" style={{ flex: '0 0 300px', paddingRight: 0 }}>
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
            <Menu.Item as="a">
              <Icon name="home" />
              Home
            </Menu.Item>
            <Menu.Item as="a">
              <Icon name="gamepad" />
              Games
            </Menu.Item>
            <Menu.Item as="a">
              <Icon name="camera" />
              Channels
            </Menu.Item>
          </Menu>
        </Sticky>
      </div>
      <div className="column" style={{ flex: 1 }}>
        <AppHeader />
        {children}
      </div>
    </div>
  );
};

export default Layout;
