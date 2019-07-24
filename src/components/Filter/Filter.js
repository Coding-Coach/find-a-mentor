import './Filter.css';

import React, { Component } from 'react';
import classNames from 'classnames';
import AutoComplete from '../AutoComplete/AutoComplete';
import Input from '../Input/Input';
import Switch from '../Switch/Switch';

import { generateLists } from '../../listsGenerator';

export default class Filter extends Component {
  state = {
    tag: '',
    country: '',
    name: '',
    language: '',
    showFilters: false,
  };

  onTagSelect = tag => {
    this.setState({ tag });
    this.props.onTagSelected(tag);
  };

  onCountrySelect = country => {
    this.setState({ country });
    this.props.onCountrySelected(country);
  };

  onNameSelect = name => {
    this.setState({ name });
    this.props.onNameSelected(name);
  };

  onLanguageSelect = language => {
    this.setState({ language });
    this.props.onLanguageSelected(language);
  };

  onToggleFilter = () => {
    this.setState({
      showFilters: !this.state.showFilters,
    });
    this.props.onToggleFilter();
  };

  render() {
    const { onToggleSwitch, clickedTag, clickedCountry, mentors } = this.props;
    const { showFilters } = this.state;
    const { tags, countries, names, languages } = generateLists(mentors);

    return (
      <section aria-labelledby="filter" className="filter-wrapper">
        <h3 id="filter">
          Filter <span id="mentorCount">{this.props.mentorCount} Mentors</span>
          <button
            className="toggle-filter"
            onClick={this.onToggleFilter}
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
              onSelect={this.onTagSelect}
              clickedTag={clickedTag}
              data-testid="technology-filter-autocomplete"
            />
          </Input>
          <Input id="country" label="Country" key="country">
            <AutoComplete
              id="country"
              source={countries}
              onSelect={this.onCountrySelect}
              clickedCountry={clickedCountry}
              data-testid="country-filter-autocomplete"
            />
          </Input>
          <Input id="name" label="Name" key="name">
            <AutoComplete
              id="name"
              source={names}
              onSelect={this.onNameSelect}
              data-testid="name-filter-autocomplete"
            />
          </Input>
          <Input id="language" label="Language" key="language">
            <AutoComplete
              id="language"
              source={languages}
              onSelect={this.onLanguageSelect}
              data-testid="language-filter-autocomplete"
            />
          </Input>
          <Switch id="fav" label="My Favorites" onToggle={onToggleSwitch} />
        </div>
      </section>
    );
  }
}
