import './AutoComplete.css';

import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import debounce from 'lodash/debounce';
import escapeRegExp from 'lodash/escapeRegExp';
import filter from 'lodash/filter';

export default class AutoComplete extends Component {
  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => {
    this.setState({ isLoading: false, results: [], value: '' });
    this.props.onReset();
  }

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title })
    this.props.handleResultSelect(result);
  }

  handleSearchChange = (e, { value }) => {
    const { source } = this.props;
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: filter(source, isMatch),
      })
    }, 300)
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
      <div className="search-wrapper">
        <Search
          input="search"
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={debounce(this.handleSearchChange, 500, { leading: true })}
          results={results}
          value={value}
          placeholder={this.props.placeholder}
          className="search-input"
        />
      </div>
    )
  }
}