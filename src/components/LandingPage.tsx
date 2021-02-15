import * as React from 'react';
import { Button, Container, Grid, Icon, Label, Link, List } from '../components';
import { Image } from 'semantic-ui-react';
import timage from '../images/landing-background-top.png';
import bimage from '../images/landing-background-bot.png';
import { RootState } from 'store';
import { useSelector } from 'react-redux';
import * as utils from '../utils';

const LandingPage = ({}: {}): any => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserScope = useSelector((state: RootState) => state.auth.scope);

  const isVolunteer =
    currentUser &&
    utils.hasPermission({ currentScope: currentUserScope, requiredScope: ['Volunteer'] });
  const user = currentUser?.firstName;
  const rolename = currentUser?.roleName;

  return (
    <React.Fragment>
      {isVolunteer ? (
        <div className="videodesc">
          <Image src={timage} fluid rounded />

          <h2>
            <Icon size="big" name="user" color="teal" float="left" />
            {'Hello ' + user}
          </h2>
          <p>
            <br />
            Welcome to the MBT timestamping tool.{' '}
          </p>
          <p>
            Thank you for your interest and contribution to the timestamping project. You can start
            by selecting any video from the list on the right. Or you can search for videos using
            video titles, video ID or any keywords.
          </p>
          {user === 'Guest' && <p>Please log in before you begin.</p>}
          <p>
            You can timestamp already processed videos. List them by unchecking the{' '}
            <strong>Hide Processed Videos.</strong>
          </p>
          <p>
            See here for a brief tutorial on timestamping : &nbsp;
            <a
              href="https://drive.google.com/file/d/1iEbK2paCpbjqGIEusM5YBQL-SaA9Z2lM/view"
              target="_blank"
              rel="noopener noreferrer"
            >
              MBT Timestamping Guide
            </a>
          </p>
          <p>
            You can ask for help or offer your comments, feedback and suggestions on our Slack
            channel here : &nbsp;
            <a
              href="https://app.slack.com/client/TK00UBC3W/C014QD9C4SE?cdn_fallback=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              MBT Timestamping Volunteers Channel on Slack
            </a>
          </p>
          <p>
            <br />
            <br />
            <br />
            <small>
              User Info: <br />
              {'Scope : ' + (currentUserScope && currentUserScope[1])} <br />
              {'Role Name : ' + rolename}
            </small>
          </p>
          <Image src={bimage} fluid rounded />
        </div>
      ) : (
        <div className="videodesc">
          <Image src={timage} fluid rounded />

          <h2>
            <Icon size="big" name="user" color="teal" float="left" />
            {'Hello ' + user}
          </h2>
          <p>
            <br />
            Welcome to the <b>MBT Guide</b>!{' '}
          </p>
          <p></p>
          {user === 'Guest' && <p>Please log in (or sign up) before you begin.</p>}
          <p>
            This is an introduction to the My Big TOE, a theory of everything. You can search the
            video content using keywords, browse through the segments of your interest, create
            playlists of topics and also create your own segments of videos.
            <br />
            You can also bookmark your favorite parts and discuss them in comments.
          </p>
          <p>You can ask for help or offer your feedback and suggestions on the contact page.</p>
          <p>
            If you are interested in contributing as a volunteer, follow this link:&nbsp;
            <a
              href="https://www.my-big-toe.com/mbt-links/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MBT Website
            </a>
          </p>
          <p></p>

          <Image src={bimage} fluid rounded />
        </div>
      )}
    </React.Fragment>
  );
};

export default LandingPage;
