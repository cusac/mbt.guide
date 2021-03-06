import LandingPage from 'components/LandingPage';
import React from 'react';
import { history } from 'utils';

const Home = ({ param }: { param?: string }): JSX.Element => {
  const routes = ['videos', 'semgents', 'contact', 'my-segments'];
  if (param && routes.includes(param)) {
    return <div></div>;
  } else if (param) {
    history.push(`videos/${param}`);
  }
  return param ? <div></div> : <LandingPage />;
};

export default Home;
