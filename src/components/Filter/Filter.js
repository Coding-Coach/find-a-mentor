import './Filter.css';

import React, { useCallback } from 'react';
import classNames from 'classnames';
import AutoComplete from '../AutoComplete/AutoComplete';
import Input from '../Input/Input';
import Switch from '../Switch/Switch';
import { generateLists } from '../../listsGenerator';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import {useFilterParams } from '../../utils/permaLinkService';

export default function Filter(props) {
  const [filters, dispatch] = useFilters();
  const { tag, country, language, name } = filters;
  const { onToggleFilter, onToggleSwitch, mentors, showFavorite } = props;
  const { showFilters } = filters;
  const { tags, countries, names, languages } = generateLists(mentors);
  const {setFilterParams} = useFilterParams();

  // const onTagSelect = useCallback(
  //   tag => {
  //     dispatch({ type: 'filterTag', payload: tag.value });
  //   },
  //   [dispatch]
  // );

  // const onCountrySelect = useCallback(
  //   country => {
  //     dispatch({ type: 'filterCountry', payload: country.value });
  //   },
  //   [dispatch]
  // );

  // const onNameSelect = useCallback(
  //   name => {
  //     dispatch({ type: 'filterName', payload: name.value });
  //   },
  //   [dispatch]
  // );

  // const onLanguageSelect = useCallback(
  //   language => {
  //     dispatch({ type: 'filterLanguage', payload: language.value });
  //   },
  //   [dispatch]
  // );

  const onFilterChange = name => ({value}) => {
    setFilterParams(name, value);
  }

  const onTagSelect = onFilterChange('technology')
  const onCountrySelect = onFilterChange('country')
  const onNameSelect = onFilterChange('name')
  const onLanguageSelect = onFilterChange('language')

  const onToggleShowFilters = useCallback(() => {
    dispatch({ type: 'showFilters', payload: !filters.showFilters });
    onToggleFilter();
  }, [filters.showFilters, onToggleFilter, dispatch]);

  const countryLabel = useCallback(() => {
    const countryObject = countries.find(element => element.value === country);
    return (countryObject && countryObject.label) || '';
  }, [countries, country]);

  const languageLabel = useCallback(() => {
    const languageObject = languages.find(
      element => element.value === language
    );
    return (languageObject && languageObject.label) || '';
  }, [languages, language]);

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
            value={tag}
            id="technology"
            source={tags}
            onSelect={onTagSelect}
            showClear
            data-testid="technology-filter-autocomplete"
          />
        </Input>
        <Input id="country" label="Country" key="country">
          <AutoComplete
            value={countryLabel()}
            id="country"
            source={countries}
            onSelect={onCountrySelect}
            showClear
            data-testid="country-filter-autocomplete"
          />
        </Input>
        <Input id="name" label="Name" key="name">
          <AutoComplete
            value={name}
            id="name"
            source={names}
            onSelect={onNameSelect}
            showClear
            data-testid="name-filter-autocomplete"
          />
        </Input>
        <Input id="language" label="Language" key="language">
          <AutoComplete
            value={languageLabel()}
            id="language"
            source={languages}
            onSelect={onLanguageSelect}
            showClear
            data-testid="language-filter-autocomplete"
          />
        </Input>
        <Switch
          isChecked={showFavorite}
          id="fav-filter"
          label="My Favorites"
          onToggle={onToggleSwitch}
        />
      </div>
    </section>
  );
}
