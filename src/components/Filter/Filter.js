import "./Filter.css";
import mentors from "../../mentors.json";

import React, { Component } from "react";
import classNames from 'classnames';
import AutoComplete from '../AutoComplete/AutoComplete';
import Input from "../Input/Input";

import { generateLists } from "../../listsGenerator";
const { tags, countries, names } = generateLists(mentors);

export default class Filter extends Component {
  state = {
    tag: '',
    country: '',
    name: '',
    showFilters: false,
  }

  onTagSelect = tag => {
    this.setState({tag});
    this.props.onTagSelected(tag);
  }

  onCountrySelect = country => {
    this.setState({country});
    this.props.onCountrySelected(country);
  }

  onNameSelect = name => {
    this.setState({name});
    this.props.onNameSelected(name);
  }

  onToggleFilter = () => {
    this.setState({
      showFilters: !this.state.showFilters
    });
    this.props.onToggleFilter();
  }

  render() {
    const { showFilters } = this.state;

    return (
      <aside aria-labelledby="filter">
        <h3 id="filter">
          Filter <span id="mentorCount">{this.props.mentorCount} Mentors</span>
          <button className="toggle-filter" onClick={this.onToggleFilter}>
            <i className={classNames(['fa fa-angle-down', {'show-filters': showFilters}])} />
          </button>
        </h3>
        <div className="inputs">
          <Input id="language" label="Language or technology" key="language">
            <AutoComplete
              source={tags}
              onSelect={this.onTagSelect}
            />
          </Input>
          <Input id="country" label="Country" key="country">
            <AutoComplete
              source={countries}
              onSelect={this.onCountrySelect}
            />
          </Input>
          <Input id="name" label="Name" key="name">
            <AutoComplete
              source={names}
              onSelect={this.onNameSelect}
            />
          </Input>
        </div>
      </aside>
    );
  }
}