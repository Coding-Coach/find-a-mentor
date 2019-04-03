import "./Filter.css";
import mentors from "../../mentors.json";

import React, { Component } from "react";
import classNames from "classnames";
import AutoComplete from "../AutoComplete/AutoComplete";
import Input from "../Input/Input";

import { generateLists } from "../../listsGenerator";
const { tags, countries, names } = generateLists(mentors);

export default class Filter extends Component {
  state = {
    tag: "",
    country: "",
    name: "",
    showFilters: false
  };

  onTagSelect = tag => {
    this.setState({ tag });
    this.props.onTagSelected(tag);
    this.setPermalink('tech', tag.value);
  };

  onCountrySelect = country => {
    this.setState({ country });
    this.props.onCountrySelected(country);
    this.setPermalink('country', country.value);
  };

  onNameSelect = name => {
    this.setState({ name });
    this.props.onNameSelected(name);
    this.setPermalink('name', name.value);
  };

  onToggleFilter = () => {
    this.setState({
      showFilters: !this.state.showFilters
    });
    this.props.onToggleFilter();
  };

  setPermalink = (param, value) => {
    let permalink = new URLSearchParams(window.location.search);
    value.length ? permalink.set(param, value) : permalink.delete(param);
    window.history.pushState({}, null, "?" + permalink.toString());
  }

  render() {
    const { showFilters } = this.state;

    return (
      <section aria-labelledby="filter" className="filter-wrapper">
        <h3 id="filter">
          Filter <span id="mentorCount">{this.props.mentorCount} Mentors</span>
          <button className="toggle-filter" onClick={this.onToggleFilter} aria-label="Toggle filter">
            <i
              className={classNames([
                "fa fa-angle-down",
                { "show-filters": showFilters }
              ])}
            />
          </button>
        </h3>
        <div className="inputs" aria-expanded={showFilters}>
          <Input id="language" label="Language or technology" key="language">
            <AutoComplete source={tags} onSelect={this.onTagSelect} />
          </Input>
          <Input id="country" label="Country" key="country">
            <AutoComplete source={countries} onSelect={this.onCountrySelect} />
          </Input>
          <Input id="name" label="Name" key="name">
            <AutoComplete source={names} onSelect={this.onNameSelect} />
          </Input>
        </div>
      </section>
    );
  }
}
