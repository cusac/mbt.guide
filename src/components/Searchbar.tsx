import React from 'reactn';

const Searchbar = ({ onHandleSubmit }: { onHandleSubmit: (arg0: string) => void }) => {
  const [term, setTerm] = React.useState('');

  const handleChange = (event: any) => {
    setTerm(event.target.value);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    onHandleSubmit(term);
  };

  return (
    <div className="search-bar ui segment">
      <form onSubmit={handleSubmit} className="ui form">
        <div className="field">
          <div className="ui icon input">
            <input
              className="prompt"
              onChange={handleChange}
              type="text"
              placeholder="Search for MBT videos"
              value={term}
            />
            <i className="search icon" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Searchbar;
