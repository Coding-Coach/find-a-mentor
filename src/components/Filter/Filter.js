import './Filter.css';

import React, { useCallback } from 'react';
import classNames from 'classnames';
import AutoComplete from '../AutoComplete/AutoComplete';
import Input from '../Input/Input';
import Switch from '../Switch/Switch';

import { generateLists } from '../../listsGenerator';
import {
  useFiltersDispatch,
  useFiltersState,
} from '../../context/filtersContext/FiltersContext';

export default function Filter(props) {
  console.log(props);
  const filters = useFiltersState();
  const dispatch = useFiltersDispatch();
  const {
    onTagSelected,
    onCountrySelected,
    onNameSelected,
    onLanguageSelected,
    onToggleFilter,
    onToggleSwitch,
    clickedTag,
    clickedCountry,
    clickedUser,
    mentors,
  } = props;
  const { showFilters } = filters;
  const { tags, countries, names, languages } = generateLists(mentors);

  const onTagSelect = useCallback(
    tag => {
      dispatch({ type: 'filterTag', payload: tag });
      onTagSelected(tag);
    },
    [onTagSelected, dispatch]
  );

  const onCountrySelect = useCallback(
    country => {
      dispatch({ type: 'filterCountry', payload: country });
      onCountrySelected(country);
    },
    [onCountrySelected, dispatch]
  );

  const onNameSelect = useCallback(
    name => {
      dispatch({ type: 'filterName', payload: name });
      onNameSelected(name);
    },
    [onNameSelected, dispatch]
  );

  const onLanguageSelect = useCallback(
    language => {
      dispatch({ type: 'filterLanguage', payload: language });
      onLanguageSelected(language);
    },
    [onLanguageSelected, dispatch]
  );

  const onToggleShowFilters = useCallback(() => {
    dispatch({ type: 'showFilters', payload: !filters.showFilters });
    onToggleFilter();
  }, [filters.showFilters, onToggleFilter, dispatch]);

  return (
    <section aria-labelledby="filter" className="filter-wrapper">
      <h3 id="filter">
        Filter <span id="mentorCount">{props.mentorCount} Mentors</span>
        <button
          className="toggle-filter"
          onClick={onToggleShowFilters}
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
            clickedUser={clickedUser}
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
}
