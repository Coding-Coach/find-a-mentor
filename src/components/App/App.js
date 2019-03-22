import "./App.css";
import mentors from "../../mentors.json";

import React, { Component } from "react";
import classNames from "classnames";
import MentorsList from "../MentorsList/MentorsList";
import Filter from "../Filter/Filter";
import Header from "../Header/Header";
import shuffle from "lodash/shuffle";

// const serverEndpoint = 'http://localhost:3001';
class App extends Component {
  state = {
    mentors: shuffle(mentors)
  };

  handleTagSelect = async ({value: tag}) => {
    await scrollToTop();
    this.setState({
      tag
    });
  };

  handleCountrySelect = async ({value: country}) => {
    await scrollToTop();
    this.setState({
      country
    });
  };

  handleNameSelect = async ({value: name}) => {
    await scrollToTop();
    this.setState({
      name
    });
  }

  filterMentors = mentor => {
    const { tag, country, name } = this.state;
    return (
      (!tag || mentor.tags.includes(tag)) &&
      (!country || mentor.country === country) &&
      (!name || mentor.name === name)
    );
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
            onTagSelected={this.handleTagSelect}
            onCountrySelected={this.handleCountrySelect}
            onNameSelected={this.handleNameSelect}
            onToggleFilter={this.toggleFields}
            mentorCount={mentorsInList.length} />
          <MentorsList
            className={classNames({
              active: fieldsIsActive
            })}
            mentors={mentorsInList}
          />
        </main>
        <footer>
          <a rel="noopener noreferrer" href="https://github.com/Coding-Coach/coding-coach/blob/develop/src/pages/static/TermsAndConditions.md#terms-and-conditions" target="_blank">Terms & Conditions</a>
          <a rel="noopener noreferrer" href="https://github.com/Coding-Coach/coding-coach/blob/develop/src/pages/static/CookiesPolicy.md#what-are-cookies" target="_blank">Cookies</a>
          <a rel="noopener noreferrer" href="https://github.com/Coding-Coach/coding-coach/blob/develop/src/pages/static/PrivacyPolicy.md#effective-date-october-03-2018" target="_blank">Privacy Policy</a>
        </footer>
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