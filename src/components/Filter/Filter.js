import React, { Component } from "react";
import AutoComplete from '../AutoComplete/AutoComplete';
import Input from "../Input/Input";

import "./Filter.css";

export default class Filter extends Component {
  state = {
    tag: '',
    country: '',
  }

  onTagSelect = tag => {
    this.setState({tag});
    if (tag) {
      this.props.onTagSelected(tag);
    } else {
      this.props.onResetTag();
    }
  }

  onCountrySelect = country => {
    this.setState({country});
    if (country) {
      this.props.onCountrySelected(country);
    } else {
      this.props.onResetCountry();
    }
  }

  render() {
    const { tags, countries } = this.props;

    return (
      <aside aria-labelledby="filter">
        <h1 id="filter">Filter</h1>
        <Input id="language" label="Language or technology" key="language">
          <AutoComplete
            source={tags}
            onSelect={this.onTagSelect}
            onReset={this.onTagSelect}
          />
        </Input>
        <Input id="country" label="Country" key="country">
          <AutoComplete
            source={countries}
            onSelect={this.onCountrySelect}
            onReset={this.onTagSelect}
          />
        </Input>
      </aside>
    );
  }
}