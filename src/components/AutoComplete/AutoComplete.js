import './AutoComplete.css';

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';

function renderInput(props) {
  return <input {...props} className="input" />;
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

  componentDidMount() {
    this.getPermalinkParams();
  }

  onSelect = (value, item) => {
    this.setState({ value });
    this.props.onSelect(item);
    this.setPermalinkParams(this.props.id, value)
  };

  onChange = (event, value) => {
    this.setState({ value });
    if (!value) {
      this.props.onSelect({ value: '', label: '' });
    }
    this.setPermalinkParams(this.props.id, value)
  };

  matchStateToTerm(state, value) {
    return state.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
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
    if(paramItem.length && value.length) {
      permalink.set(param, paramItem[0].value);
    } else if (!value.length) {
      permalink.delete(param);
    }
    window.history.pushState({}, null, "?" + permalink.toString());
  }

  render() {
    const { value } = this.state;
    const { id, source } = this.props;

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
          }}
        />
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
