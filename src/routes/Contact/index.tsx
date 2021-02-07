import * as React from 'react';
import { Button, Container, Grid, Icon, Label, Link, List } from '../../components';
import { Image } from 'semantic-ui-react';

const Contact = ({}: {}): any => {
  return (
    <React.Fragment>
      <div className="contact">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSczVebMK-7iGEuJu2P7Bu88U5zTHrHn4Q2gxkdP83-f3cjPwA/viewform?embedded=true"
          width="640"
          height="750"
          frameBorder="0"
        >
          Loading…
        </iframe>
      </div>
    </React.Fragment>
  );
};

export default Contact;
