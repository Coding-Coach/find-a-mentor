import "./App.css";
import mentors from "../../mentors.json";

import React, { Component } from "react";
import classNames from "classnames";
import MentorsList from "../MentorsList/MentorsList";
import Filter from "../Filter/Filter";
import Header from "../Header/Header";
import shuffle from "lodash/shuffle";
import { generateLists } from "../../listsGenerator";

const { tags, countries } = generateLists(mentors);
const mapToDropdown = item => ({ label: item });
const tagsSource = tags.map(mapToDropdown);
const countriesSource = countries.map(mapToDropdown);

// const serverEndpoint = 'http://localhost:3001';
class App extends Component {
  state = {
    mentors: shuffle(mentors)
  };

  handleTagSelect = tag => {
    this.setState({
      tag
    });
  };

  handleCountrySelect = country => {
    this.setState({
      country
    });
  };

  filterMentors = mentor => {
    const { tag, country } = this.state;
    return (
      (!tag || mentor.tags.includes(tag)) &&
      (!country || mentor.country === country)
    );
  };

  resetTag = () => {
    this.setState({
      tag: ""
    });
  };

  resetCountry = () => {
    this.setState({
      country: ""
    });
  };

  toggleFields = () => {
    this.setState({
      fieldsIsActive: !this.state.fieldsIsActive
    });
  };

  render() {
    const { mentors, fieldsIsActive } = this.state;
    const mentorsInList = mentors.filter(this.filterMentors);

    return (
      <div className="app">
        <Header />
        <main>
          <Filter
            tags={tagsSource}
            countries={countriesSource}
            onTagSelected={this.handleTagSelect}
            onCountrySelected={this.handleCountrySelect}
            onResetTag={this.resetTag}
            onResetCountry={this.resetCountry} />
        {/* <div className="filters-outer">
          <div className="filters">
            <Header as="h1">
              <div>
                Find a mentor
                <Button
                  size="huge"
                  floated="right"
                  className="tertiary mobile"
                  icon
                  onClick={this.toggleFields}
                >
                  <Icon name="filter" />
                </Button>
              </div>
              <Header.Subheader>
                {mentors.length} mentors available
              </Header.Subheader>
            </Header>
            <div className="fields">
              <AutoComplete
                placeholder="Language or Technology"
                source={tagsSource}
                handleResultSelect={this.handleTagSelect}
                onReset={this.resetTag}
              />
              <AutoComplete
                placeholder="Country"
                source={countriesSource}
                handleResultSelect={this.handleCountrySelect}
                onReset={this.resetCountry}
              />
            </div>
          </div>
        </div> */}
          <MentorsList
            className={classNames({
              active: fieldsIsActive
            })}
            mentors={mentorsInList}
          />
        </main>
      </div>
    );
  }
}

export default App;
