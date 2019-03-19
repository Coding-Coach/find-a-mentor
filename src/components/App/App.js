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

  handleTagSelect = async tag => {
    await scrollToTop();
    this.setState({
      tag
    });
  };

  handleCountrySelect = async country => {
    await scrollToTop();
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

  resetTag = async () => {
    await scrollToTop();
    this.setState({
      tag: ''
    });
  };

  resetCountry = async () => {
    await scrollToTop();
    this.setState({
      country: ''
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

function scrollToTop() {
  const scrollDuration = 200;
  return new Promise(resolve => {
    var scrollStep = -window.scrollY / (scrollDuration / 15),
        scrollInterval = setInterval(function(){
        if ( window.scrollY !== 0 ) {
            window.scrollBy( 0, scrollStep );
        }
        else {
          clearInterval(scrollInterval);
          resolve();
        }
    },15);
  });
}