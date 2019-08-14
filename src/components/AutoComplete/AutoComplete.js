import './AutoComplete.css';

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';
import FilterClear from '../FilterClear/FilterClear';

function renderInput(props) {
  return <input {...props} className="input" autoComplete="off" />;
}

function renderItem(item, isHighlighted) {
  return (
    <div
      key={item.label}
      className={classNames(['ac-item', { highlight: isHighlighted }])}
    >
      {item.label}
    </div>
  );
}

function renderMenu(items, value, style) {
  return <div className="ac-menu" children={items} />;
}

export default class AutoComplete extends Component {
  state = {
    value: '',
  };

  onSelect = (value, item) => {
    this.setState({ value });
    this.props.onSelect(item);
    this.setPermalinkParams(this.props.id, value);
  };

  onChange = (event, value) => {
    this.setState({ value });
    if (!value) {
      this.props.onSelect({ value: '', label: '' });
    }
    this.setPermalinkParams(this.props.id, value);
  };

  onClear = event => {
    this.onChange(event, '');
  };

  matchStateToTerm(state, value) {
    return (
      state.label &&
      state.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  getPermalinkParams() {
    const permalink = new URLSearchParams(window.location.search);
    const paramValue = permalink.get(this.props.id);
    const paramItem = this.props.source.filter(
      item => item.value === paramValue
    );
    if (paramItem.length) {
      this.setState({ value: paramItem[0].label, label: paramValue });
      this.props.onSelect({ value: paramValue, label: paramItem[0].label });
    }
  }

  setPermalinkParams = (param, value) => {
    const permalink = new URLSearchParams(window.location.search);
    const paramItem = this.props.source.filter(item => item.label === value);
    if (paramItem.length && value.length) {
      permalink.set(param, paramItem[0].value);
    } else if (!value.length) {
      permalink.delete(param);
    }
    window.history.pushState({}, null, '?' + permalink.toString());
  };

  componentDidMount() {
    this.getPermalinkParams();
  }

  componentDidUpdate(prevProps) {
    const { clickedTag: value, clickedCountry } = this.props;

    if (prevProps.clickedTag !== this.props.clickedTag) {
      this.setState({ value });
      this.props.onSelect({ value });
      this.setPermalinkParams(this.props.id, value);
    }

    if (prevProps.clickedCountry !== clickedCountry) {
      const code = this.props.source.find(
        item => item.value === clickedCountry
      );

      this.setState({ value: code.label });
      this.props.onSelect({ value: code.value });
      this.setPermalinkParams(this.props.id, code.label);
    }
  }

  render() {
    const { value } = this.state;
    const { showClear, source, 'data-testid': testid } = this.props;
    let { id } = this.props;
    id = `${id}-${Math.random()}`;

    return (
      <div className="ac">
        <Autocomplete
          value={value}
          items={source}
          renderItem={renderItem}
          renderMenu={renderMenu}
          renderInput={renderInput}
          wrapperStyle={{}}
          getItemValue={item => item.label}
          shouldItemRender={this.matchStateToTerm}
          onSelect={this.onSelect}
          onChange={this.onChange}
          inputProps={{
            id,
            'data-testid': testid,
          }}
        />
        {showClear && value && (
          <div className={'clear-btn'}>
            <FilterClear onClear={this.onClear} />
          </div>
        )}
      </div>
    );
  }
}

// export default class AutoComplete extends Component {
//   componentWillMount() {
//     this.resetComponent()
//   }

//   resetComponent = () => {
//     this.setState({ isLoading: false, results: [], value: '' });
//     this.props.onReset();
//   }

//   handleResultSelect = (e, { result }) => {
//     this.setState({ value: result.title })
//     this.props.handleResultSelect(result);
//   }

//   handleSearchChange = (e, { value }) => {
//     const { source } = this.props;
//     this.setState({ isLoading: true, value })

//     setTimeout(() => {
//       if (this.state.value.length < 1) return this.resetComponent()

//       const re = new RegExp(escapeRegExp(this.state.value), 'i')
//       const isMatch = result => re.test(result.title)

//       this.setState({
//         isLoading: false,
//         results: filter(source, isMatch),
//       })
//     }, 300)
//   }

//   render() {
//     const { isLoading, value, results } = this.state

//     return (
//       <div className="search-wrapper">
//         <Search
//           input="search"
//           loading={isLoading}
//           onResultSelect={this.handleResultSelect}
//           onSearchChange={debounce(this.handleSearchChange, 500, { leading: true })}
//           results={results}
//           value={value}
//           placeholder={this.props.placeholder}
//           className="search-input"
//         />
//       </div>
//     )
//   }
// }
