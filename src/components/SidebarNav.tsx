import React from 'react';
import { Sidebar, SegmentUI, Menu, Icon } from '../components';

const SidebarNav = ({ children, test }: any) => {
  return (
    <Sidebar.Pushable as={SegmentUI}>
      <Sidebar
        // as={Segment}
        style={{ overflow: 'hidden' }}
        as={Menu}
        // as={'div'}
        animation={'slide along'}
        direction={'left'}
        icon="labeled"
        visible={true}
        vertical
        width="thin"
      >
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
      </Sidebar>

      <Sidebar.Pusher>
        <div>{test}</div>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default SidebarNav;
