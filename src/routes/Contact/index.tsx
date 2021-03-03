import * as React from 'react';

//The responses are emailed to the owner, and are also saved in a google sheet here:
//https://docs.google.com/spreadsheets/d/1xVLwN8bPslgq-JtmKJKWd_JeIHglklfUeNscE-Bb1YA/edit#gid=1364178731
//We can change this to any form, any email and any sheet if needed.

const Contact = (): any => {
  return (
    <React.Fragment>
      <div className="contact">
        <iframe
          title="contact"
          src="https://docs.google.com/forms/d/e/1FAIpQLSczVebMK-7iGEuJu2P7Bu88U5zTHrHn4Q2gxkdP83-f3cjPwA/viewform?embedded=true"
          width="800"
          height="800"
          frameBorder="0"
        >
          Loading…
        </iframe>
      </div>
    </React.Fragment>
  );
};

export default Contact;
