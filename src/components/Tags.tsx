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
    id: uuid(),
    text: mbttags,
  };
});

const KeyCodes = {
  comma: 188,
  enter: 13,
};

type tagstruct = {
  rank: number;
  segment: string;
  tag: { name: string };
  _id: string;
};

interface MyProps {
  tags: { id: string; text: string }[];
  seg: any;
  rank: number;
  forceUpdate: any;
}

interface MyState {
  tags: any;
  suggestions: any;
  k: number;
}

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class Tags extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.state = {
      tags: props.tags,
      suggestions: suggestions,
      k: 1,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
  }

  handleDelete(i: any) {
    const { tags } = this.state;
    const delIndex = tags[i].id;

    this.setState({
      tags: tags.filter((tag: any, index: any) => index !== i),
    });

    //del from segment
    for (let j = 0; j < this.props.seg.tags.length; j++) {
      if (this.props.seg.tags[j].tag._id == delIndex) {
        this.props.seg.tags.splice(j, 1);
      }
    }
  }

  handleAddition(tag: any) {
    tag.id = uuid();

    //force lowercase
    tag.text = tag.text.toLowerCase();

    //remove duplicates
    for (let index = 0; index < this.props.seg.tags.length; index++) {
      const element = this.props.seg.tags[index];
      if (tag.text === this.props.seg.tags[index].tag.name) {
        this.props.seg.tags.splice(index, 1);
      }
    }

    this.setState(state => ({ tags: [...state.tags, tag] }));

    let newtag: tagstruct = {
      rank: this.props.rank,
      segment: this.props.seg._id,
      tag: { name: tag.text },
      _id: uuid(),
    };

    this.props.seg.tags.push(newtag);
    this.props.seg.pristine = true;
    this.props.forceUpdate();
  }

  handleDrag(tag: any, currPos: any, newPos: any) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    tag && newTags.splice(currPos, 1);
    tag && newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  handleTagClick(index: any) {
    console.log('The tag at index ' + index + ' was clicked');
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
          autofocus={false}
          allowDeleteFromEmptyInput={false}
          allowDragDrop={false}
        />
      </div>
    );
  }
}

export default Tags;
