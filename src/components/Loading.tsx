// https://refreshless.com/nouislider/import 'nouislider/distribute/nouislider.css';
import React from 'react';
import * as components from '../components';

const { Container, Header, Icon } = components;

export type Range = { min: number; max: number };

const Loading = ({ children }: { children: any }) => {
  return (
    <React.Fragment>
      <Container style={{ height: 300, marginTop: 50 }} textAlign="center">
        <Header as="h2" icon textAlign="center">
          <Icon loading name="spinner" />
          <Header.Content>{children}</Header.Content>
        </Header>
      </Container>
    </React.Fragment>
  );
};

export default Loading;
