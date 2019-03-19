import React, { Component } from "react";
import classNames from 'classnames';
import AutoComplete from '../AutoComplete/AutoComplete';
import Input from "../Input/Input";

import "./Filter.css";

export default class Filter extends Component {
  state = {
    tag: '',
    country: '',
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

  onToggleFilter = () => {
    this.setState({
      showFilters: !this.state.showFilters
    });
    this.props.onToggleFilter();
  }

  render() {
    const { tags, countries } = this.props;
    const { showFilters } = this.state;

    return (
      <aside aria-labelledby="filter">
        <h3 id="filter">
          Filter
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
        </div>
      </aside>
    );
  }
}