import './Filter.css';
import mentors from '../../mentors.json';

import React, { Component } from 'react';
import classNames from 'classnames';
import AutoComplete from '../AutoComplete/AutoComplete';
import Input from '../Input/Input';
import Switch from '../Switch/Switch';

import { generateLists } from '../../listsGenerator';
const { tags, countries, names } = generateLists(mentors);

export default class Filter extends Component {
  state = {
    tag: '',
    country: '',
    name: '',
    showFilters: false,
  };

  onTagSelect = tag => {
    this.setState({ tag });
    this.props.onTagSelected(tag);
    this.setPermalinkParams('language', tag.value);
  };

  onCountrySelect = country => {
    this.setState({ country });
    this.props.onCountrySelected(country);
    this.setPermalinkParams('country', country.value);
  };

  onNameSelect = name => {
    this.setState({ name });
    this.props.onNameSelected(name);
    this.setPermalinkParams('name', name.value);
  };

  onToggleFilter = () => {
    this.setState({
      showFilters: !this.state.showFilters,
    });
    this.props.onToggleFilter();
  };

  setPermalinkParams = (param, value) => {
    let permalink = new URLSearchParams(window.location.search);
    value.length ? permalink.set(param, value) : permalink.delete(param);
    window.history.pushState({}, null, '?' + permalink.toString());
  };

  render() {
    const { onToggleSwitch } = this.props;
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
          <Input id="language" label="Language or technology" key="language">
            <AutoComplete
              id="language"
              source={tags}
              onSelect={this.onTagSelect}
            />
          </Input>
          <Input id="country" label="Country" key="country">
            <AutoComplete
              id="country"
              source={countries}
              onSelect={this.onCountrySelect}
            />
          </Input>
          <Input id="name" label="Name" key="name">
            <AutoComplete
              id="name"
              source={names}
              onSelect={this.onNameSelect}
            />
          </Input>
          <Switch id="fav" label="My Favorites" onToggle={onToggleSwitch} />
        </div>
      </section>
    );
  }
}
