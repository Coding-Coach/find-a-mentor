import './Filter.css';

import React, { useReducer } from 'react';
import classNames from 'classnames';
import AutoComplete from '../AutoComplete/AutoComplete';
import Input from '../Input/Input';
import Switch from '../Switch/Switch';

import { generateLists } from '../../listsGenerator';

const Filter = props => {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      tag: '',
      country: '',
      name: '',
      language: '',
      showFilters: false,
    }
  );

  const onTagSelect = tag => {
    setState({ tag });
    props.onTagSelected(tag);
  };

  const onCountrySelect = country => {
    setState({ country });
    props.onCountrySelected(country);
  };

  const onNameSelect = name => {
    setState({ name });
    props.onNameSelected(name);
  };

  const onLanguageSelect = language => {
    setState({ language });
    props.onLanguageSelected(language);
  };

  const onToggleFilter = () => {
    setState({
      showFilters: !state.showFilters,
    });
    props.onToggleFilter();
  };

  const { onToggleSwitch, clickedTag, clickedCountry, mentors } = props;
  const { showFilters } = state;
  const { tags, countries, names, languages } = generateLists(mentors);

  return (
    <section aria-labelledby="filter" className="filter-wrapper">
      <h3 id="filter">
        Filter <span id="mentorCount">{props.mentorCount} Mentors</span>
        <button
          className="toggle-filter"
          onClick={onToggleFilter}
          aria-label="Toggle filter"
        >
          <i
            className={classNames([
              'fa fa-angle-down',
              { 'show-filters': showFilters },
            ])}
          />
        </button>
      </h3>
      <div className="inputs" aria-expanded={showFilters}>
        <Input id="technology" label="Technology" key="technology">
          <AutoComplete
            id="technology"
            source={tags}
            onSelect={onTagSelect}
            clickedTag={clickedTag}
            showClear
            data-testid="technology-filter-autocomplete"
          />
        </Input>
        <Input id="country" label="Country" key="country">
          <AutoComplete
            id="country"
            source={countries}
            onSelect={onCountrySelect}
            clickedCountry={clickedCountry}
            showClear
            data-testid="country-filter-autocomplete"
          />
        </Input>
        <Input id="name" label="Name" key="name">
          <AutoComplete
            id="name"
            source={names}
            onSelect={onNameSelect}
            showClear
            data-testid="name-filter-autocomplete"
          />
        </Input>
        <Input id="language" label="Language" key="language">
          <AutoComplete
            id="language"
            source={languages}
            onSelect={onLanguageSelect}
            showClear
            data-testid="language-filter-autocomplete"
          />
        </Input>
        <Switch id="fav" label="My Favorites" onToggle={onToggleSwitch} />
      </div>
    </section>
  );
};

export default Filter;
