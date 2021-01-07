import React from 'reactn';

export type SearchType = 'video' | 'segment';

const Searchbar = ({
  onHandleSubmit,
  searchType,
}: {
  onHandleSubmit: (arg0: string) => void;
  searchType: SearchType;
}): any => {
  const [term, setTerm] = React.useState('');

  const handleChange = (event: any) => {
    setTerm(event.target.value);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    onHandleSubmit(term);
  };

  const getPlaceHolder = () => {
    return searchType === 'video'
      ? 'Search for MBT youtube videos'
      : 'Search for MBT video segments';
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
              placeholder={getPlaceHolder()}
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
