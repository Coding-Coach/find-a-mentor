import React from 'react';
import Input from '../Input/Input';
import Tag from '../Tag/Tag';
import AutoComplete from '../AutoComplete/AutoComplete';

import './TechnologyInput.css';

const TechnologyInput = ({
  tags,
  clickedTag,
  selectedTags,
  value,
  onTagChanged,
  onTagSelected,
  onTagRemoved,
}) => {
  return (
    <div>
      <div className="technology-input">
        <Input id="technology" label="Technology" key="technology">
          <AutoComplete
            id="technology"
            source={tags}
            value={value}
            onSelect={selected => selected.value && onTagSelected(selected)}
            onChange={onTagChanged}
            clickedTag={clickedTag}
            data-testid="technology-filter-autocomplete"
            fullWidth
          />
        </Input>

        <button>+ Add Filter</button>
      </div>

      {selectedTags.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {selectedTags.map(tag => (
            <Tag
              key={tag}
              onClick={e => onTagRemoved({ value: tag })}
              className="filter"
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnologyInput;
