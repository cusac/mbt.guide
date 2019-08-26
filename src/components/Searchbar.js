// @flow

import * as React from 'react';

const Searchbar = ({ onHandleSubmit }: { onHandleSubmit: string => void }) => {
  const [term, setTerm] = React.useState('');

  const handleChange = event => {
    setTerm(event.target.value);
  };
  const handleSubmit = event => {
    event.preventDefault();
    onHandleSubmit(term);
  };

  return (
    <div className="search-bar ui segment">
      <form onSubmit={handleSubmit} className="ui form">
        <div className="field">
          <div class="ui icon input">
            <input
              class="prompt"
              onChange={handleChange}
              type="text"
              placeholder="Search for MBT videos"
              value={term}
            />
            <i class="search icon" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Searchbar;
