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

  onSelect = (value, item) => {
    this.setState({ value });
    this.props.onSelect(item);
  };

  onChange = (event, value) => {
    this.setState({ value });
    if (!value) {
      this.props.onSelect({ value: '', label: '' });
    }
  };

  matchStateToTerm(state, value) {
    return state.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  }

  componentDidUpdate(prevProps) {
    const { clickedTag: value } = this.props;

    if (prevProps.clickedTag !== this.props.clickedTag) {
      this.setState({ value });
      this.props.onSelect({ value });
    }
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
