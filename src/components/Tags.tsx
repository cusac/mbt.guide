import { differenceBy, isEqual, uniq, uniqBy } from 'lodash';
import * as React from 'react';
//Dependencies for drag n drop tags with suggestions
//npm install --save react-tag-input
//npm install --save react-dnd@5.0.0
//npm install --save react-dnd-html5-backend@3.0.2
import { WithContext as ReactTags, Tag as ReactTag } from 'react-tag-input';
import { assertModelArrayType, Segment, SegmentTag, Tag as AppTag } from 'types';
import { MBTTAGS } from './TagSuggestions';
import { repository } from 'services';

const presetSuggestions: ReactTag[] = MBTTAGS.map((mbttag) => ({
  id: mbttag.toLowerCase(), // MBT Tags are globally unique, so the tag name serves as the id
  text: mbttag.toLowerCase(),
}));

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const Tags = ({
  disabled,
  currentSegment,
  segmentIndex,
  rank,
  updateSegmentAt,
  refresh,
}: {
  disabled: boolean;
  currentSegment: Segment;
  segmentIndex: number;
  rank: number;
  updateSegmentAt: (index: number, data: Partial<Segment>) => void;
  refresh: [boolean];
}): JSX.Element => {
  const [reactTags, setReactTags] = React.useState<ReactTag[]>([]);
  const [suggestions, setSuggestions] = React.useState([] as ReactTag[]);

  const segmentTagToReactTag = (segTag: SegmentTag): ReactTag => ({
    text: segTag.tag.name,
    id: segTag.tag.name,
  });

  const reactTagToSegmentTag = (reactTag: ReactTag): SegmentTag => ({
    tag: { name: reactTag.text },
    rank,
  });

  const tagToReactTag = (tag: AppTag): ReactTag => ({
    text: tag.name,
    id: tag.name,
  });

  const updateTags = (tags: ReactTag[]) => {
    let currentSegmentTags = currentSegment.tags || [];
    if (assertModelArrayType<SegmentTag>(currentSegmentTags, 'SegmentTag')) {
      // Remove duplicates
      tags = uniq(tags);
      // Remove old tag if rank changed
      currentSegmentTags = differenceBy(
        currentSegmentTags,
        tags.map(reactTagToSegmentTag),
        'tag.name'
      );
      // Keep segments of other ranks
      currentSegmentTags = currentSegmentTags.filter((t) => t.rank !== rank);
      // Add new tags to old
      currentSegmentTags = [...currentSegmentTags, ...tags.map(reactTagToSegmentTag)];
      // Only set ReactTag[] to state
      setReactTags(tags);
      updateSegmentAt(segmentIndex, { tags: currentSegmentTags });
    }
  };

  const formatSuggestions = (suggestions: ReactTag[]): ReactTag[] => {
    return uniqBy(
      suggestions.map((tag) => ({
        id: tag.text.toLowerCase().trim(),
        text: tag.text.toLowerCase().trim(),
      })),
      'text'
    );
  };

  const handleDelete = (i: number): void => {
    const newTags = reactTags.filter((tag, index) => index !== i);
    setReactTags(newTags);
    updateTags(newTags);
  };

  const handleAddition = (tag: ReactTag): void => {
    //force lowercase
    tag.text = tag.text.toLowerCase();
    const newTags = [...reactTags, tag];
    setReactTags(newTags);
    updateTags(newTags);
  };

  const handleDrag = (tag: ReactTag, currPos: number, newPos: number) => {
    const newTags = [...reactTags];
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setReactTags(newTags);
    updateTags(newTags);
  };

  const handleTagClick = (i: number) => {
    console.log('Tag clicked at index:', i);
  };

  const handleInputChange = async (text: string) => {
    let {
      data: { docs },
    } = await repository.tag.list({ $term: text, $limit: 50, $embed: 'segments' });

    // NOTE: Soon the tag filters and formatting will be accomplished on the backend
    docs = docs.filter((tag) => tag.segments && tag.segments.length > 0);

    setSuggestions(formatSuggestions(docs.map(tagToReactTag).concat(presetSuggestions)));
  };

  // This effect will run once during component initialization
  React.useEffect(() => {
    const tagsInput = currentSegment.tags || [];
    if (assertModelArrayType<SegmentTag>(tagsInput, 'SegmentTag')) {
      setReactTags(
        tagsInput.filter((tag) => tag.tag && tag.rank === rank).map(segmentTagToReactTag)
      );
    }
  }, []);

  // This re-renders the tags when a refresh is triggered
  React.useEffect(() => {
    const tagsInput = currentSegment.tags || [];
    if (assertModelArrayType<SegmentTag>(tagsInput, 'SegmentTag')) {
      const updatedTags = tagsInput
        .filter((t) => t.tag && t.rank === rank)
        .map(segmentTagToReactTag);
      if (!isEqual(updatedTags, reactTags)) {
        setReactTags(updatedTags);
      }
    }
  }, [refresh]);

  return (
    <div>
      <ReactTags
        readOnly={disabled}
        tags={reactTags}
        suggestions={suggestions}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        handleTagClick={handleTagClick}
        handleInputChange={handleInputChange}
        autofocus={false}
        allowDeleteFromEmptyInput={false}
        allowDragDrop={false}
      />
    </div>
  );
};

export default Tags;
