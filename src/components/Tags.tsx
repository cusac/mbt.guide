import * as React from 'react';
import { MBTTAGS } from './TagSuggestions';

//Dependencies for drag n drop tags with suggestions
//npm install --save react-tag-input
//npm install --save react-dnd@5.0.0
//npm install --save react-dnd-html5-backend@3.0.2
import { WithContext as ReactTags } from 'react-tag-input';
import { stringify, v4 as uuid } from 'uuid';

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

let inputStr = '';
let editMode = false;

interface MyProps {
  tags: { id: string; text: string }[];
}

interface MyState {
  tags: any;
  suggestions: any;
  inputStr: string;
  editMode: boolean;
}

const delimiters = [KeyCodes.comma, KeyCodes.enter];

function capWords(str: string) {
  if (str == undefined) return 'Error';
  var pieces = str.split(' ');
  for (var i = 0; i < pieces.length; i++) {
    var j = pieces[i].charAt(0).toUpperCase();
    pieces[i] = j + pieces[i].substr(1);
  }
  return pieces.join(' ');
}

class Tags extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.state = {
      tags: props.tags,
      suggestions: suggestions,
      inputStr: inputStr,
      editMode: false,
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
    tag.id = uuid();
    tag.text = capWords(tag.text);
    this.setState(state => ({ tags: [...state.tags, tag] }));
  }

  handleDrag(tag: any, currPos: any, newPos: any) {
    console.log(tag, currPos, newPos);

    const tags = [...this.state.tags];
    const newTags = tags.slice();

    tag && newTags.splice(currPos, 1);
    tag && newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  handleTagClick(index: any) {
    console.log('The tag at index ' + index + ' was clicked');
    inputStr = this.state.tags[index].text;
    editMode = true;
    console.log(inputStr);
    this.setState({ inputStr, editMode });
    //editMode=false;
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
          //inputValue = {this.editMode? this.inputStr:""}
        />
        {/*JSON.stringify(this.props.tags[0])*/}
      </div>
    );
  }
}

export default Tags;
