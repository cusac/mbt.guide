// @flow

import * as React from 'react';
import { Button } from 'semantic-ui-react';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to mbt.guide!</p>
        <Button as="a" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </Button>
      </header>
    </div>
  );
};

export default App;
