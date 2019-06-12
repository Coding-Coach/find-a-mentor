import './Filter.css';

import React, { Component } from 'react';
import classNames from 'classnames';
import AutoComplete from '../AutoComplete/AutoComplete';
import Input from '../Input/Input';
import Switch from '../Switch/Switch';

export default class Filter extends Component {
  state = {
    showFilters: false,
  };

  onToggleFilter = () => {
    this.setState({
      showFilters: !this.state.showFilters,
    });
    this.props.onToggleFilter();
  };

  render() {
    const {
      onToggleSwitch,
      clickedCountry,
      country,
      countries,
      name,
      names,
      language,
      languages,
    } = this.props;
    const { showFilters } = this.state;

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
          <Input id="country" label="Country" key="country">
            <AutoComplete
              id="country"
              source={countries}
              value={country}
              onChange={this.props.onCountryChanged}
              onSelect={this.props.onCountrySelected}
              clickedCountry={clickedCountry}
              data-testid="country-filter-autocomplete"
            />
          </Input>
          <Input id="name" label="Name" key="name">
            <AutoComplete
              id="name"
              source={names}
              value={name}
              onChange={this.props.onNameChanged}
              onSelect={this.props.onNameSelected}
              data-testid="name-filter-autocomplete"
            />
          </Input>
          <Input id="language" label="Language" key="language">
            <AutoComplete
              id="language"
              source={languages}
              value={language}
              onChange={this.props.onLanguageChanged}
              onSelect={this.props.onLanguageSelected}
              data-testid="language-filter-autocomplete"
            />
          </Input>
          <Switch id="fav" label="My Favorites" onToggle={onToggleSwitch} />
        </div>
      </section>
    );
  }
}
