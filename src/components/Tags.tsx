import * as React from 'react';
import { MBTTAGS } from './TagSuggestions';

//Dependencies for drag n drop tags with suggestions
//npm install --save react-tag-input
//npm install --save react-dnd@5.0.0
//npm install --save react-dnd-html5-backend@3.0.2
import { WithContext as ReactTags } from 'react-tag-input';

const suggestions = MBTTAGS.map(mbttags => {
  return {
    id: mbttags,
    text: mbttags,
  };
});

const KeyCodes = {
  comma: 188,
  enter: 13,
};

interface MyProps {
  tags: { id: string; text: string }[];
}

interface MyState {
  tags: any;
  suggestions: any;
}

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class Tags extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.state = {
      tags: props.tags,
      suggestions: suggestions,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
  }

  handleDelete(i: any) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag: any, index: any) => index !== i),
    });
  }

  handleAddition(tag: any) {
    this.setState(state => ({ tags: [...state.tags, tag] }));
  }

  handleDrag(tag: any, currPos: any, newPos: any) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  handleTagClick(index: any) {
    console.log('The tag at index ' + index + ' was clicked');
    //console.log(this.props.tags);
    //const newTags = this.props.tags;
    //this.setState({ tags: newTags });
  }

  render() {
    const { tags, suggestions } = this.state;

    return (
      <div>
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          delimiters={delimiters}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          handleTagClick={this.handleTagClick}
        />
        {/*JSON.stringify(this.props.tags[0])*/}
      </div>
    );
  }
}

export default Tags;
