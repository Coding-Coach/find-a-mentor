import './AutoComplete.css';

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';

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
  onSelect = (value, item) => {
    this.props.onSelect(item);
    // TODO: Set permalink param here
  };

  onChange = (event, value) => {
    if (!value) {
      this.props.onSelect({ value: '', label: '' });
    }
    this.props.onChange(event);
    // TODO: Set permalink param here
  };

  matchStateToTerm(state, value) {
    return state.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  }

  renderInput(props) {
    return (
      <input
        {...props}
        className={classNames('input', { full: this.props.fullWidth })}
        autoComplete="off"
      />
    );
  }

  componentDidUpdate(prevProps) {
    const { clickedTag: value, clickedCountry } = this.props;

    if (prevProps.clickedTag !== this.props.clickedTag) {
      this.props.onSelect({ value });
    }

    if (prevProps.clickedCountry !== clickedCountry) {
      const code = this.props.source.find(
        item => item.value === clickedCountry
      );

      this.props.onSelect({ value: code.value });
      // this.setPermalinkParams(this.props.id, code.label);
    }
  }

  render() {
    const { value, source, 'data-testid': testid } = this.props;
    let { id } = this.props;
    id = `${id}-${Math.random()}`;
    console.log(source.length);

    return (
      <div className="ac">
        <Autocomplete
          value={value}
          items={source}
          renderItem={renderItem}
          renderMenu={renderMenu}
          renderInput={this.renderInput.bind(this)}
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
