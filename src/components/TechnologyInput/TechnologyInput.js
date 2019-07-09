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
  console.log(tags.length);
  return (
    <div>
      <div className="technology-input">
        <Input id="technology" label="Technology" key="technology">
          <AutoComplete
            id="technology"
            source={tags.filter(tag => !selectedTags.includes(tag.value))}
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

              <svg viewBox="0 0 43 43" width={30} height={30}>
                <g fill="none" fillRule="evenodd">
                  <polygon
                    fill="#FFF"
                    points="15 1.5 13.5 0 7.5 6 1.5 0 0 1.5 6 7.5 0 13.5 1.5 15 7.5 9 13.5 15 15 13.5 9 7.5"
                    transform="translate(14 14)"
                  />
                </g>
              </svg>
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnologyInput;
