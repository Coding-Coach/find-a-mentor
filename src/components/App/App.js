import './App.css';
import mentors from '../../mentors.json';

import React, { Component } from 'react';
import { Header, Button, Icon } from 'semantic-ui-react';
import classNames from 'classnames';
import AutoComplete from '../AutoComplete/AutoComplete';
import MentorsList from '../MentorsList/MentorsList';
import Logo from '../Logo';
import shuffle from 'lodash/shuffle';
import { generateLists } from '../../listsGenerator';

const { tags, countries } = generateLists(mentors);
const mapToDropdown = item => ({title: item})
const tagsSource = tags.map(mapToDropdown);
const countriesSource = countries.map(mapToDropdown);

// const serverEndpoint = 'http://localhost:3001';
class App extends Component {
  state = {
    mentors: shuffle(mentors)
  }

  handleTagSelect = (result) => {
    this.setState({
      tag: result.title
    })
  }

  handleCountrySelect = (result) => {
    this.setState({
      country: result.title
    })
  }

  filterMentors = mentor =>  {
    const { tag, country } = this.state;
    return (!tag || mentor.tags.includes(tag)) &&
           (!country || mentor.country === country);
  }

  resetTag = () => {
    this.setState({
      tag: '',
    });
  }

  resetCountry = () => {
    this.setState({
      country: ''
    });
  }

  toggleFields = () => {
    this.setState({
      fieldsIsActive: !this.state.fieldsIsActive
    })
  }

  // async componentDidMount() {
  //   const mentors = await fetch(`${serverEndpoint}/get_mentors`).then(res => res.json());
  //   this.setState({
  //     mentors
  //   })
  // }

  render() {
    const { mentors, fieldsIsActive } = this.state;
    const mentorsInList = mentors.filter(this.filterMentors);

    return (
      <div className="app">
        <header className="main-header">
          <a className="logo" href="/">
            <Logo
              width={110}
              height={50}
              color="#68d5b1" />
            <span>CODING COACH ALPHA</span>
          </a>
          <div className="social">
            <Button role="link" circular size="mini" as="a" icon="github" color="black" href="https://github.com/Coding-Coach/find-a-mentor" target="_blank" />
            <Button role="link" circular size="mini" as="a" icon="twitter" color="twitter" href="https://twitter.com/codingcoach_io" target="_blank" />
            <Button role="link" circular size="mini" as="a" icon="facebook" color="facebook" href="https://www.facebook.com/codingcoachio/" target="_blank" />
            <Button role="link" circular size="mini" as="a" icon="slack" color="purple" href="https://coding-coach.slack.com/join/shared_invite/enQtNTE2NDY4NTczNzE0LTMyOTAyZTFiYjE4OTUzYjgwYzk5MzlmYjgwNjUyNDZlZGY3NGVhYmU1NjdmZDQ3MmQ3YjRhYjJkMjM4OTYwNDA" target="_blank" />
          </div>
        </header>
        <div className="filters-outer">
          <div className="filters">
            <Header as='h1'>
              <div>
                Find a mentor
                <Button size="huge" floated='right' className="tertiary mobile" icon onClick={this.toggleFields}>
                  <Icon name="filter" />
                </Button>
              </div>
              <Header.Subheader>{mentors.length} mentors available</Header.Subheader>
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
        </div>
        <MentorsList
          className={classNames({
            'active': fieldsIsActive
          })}
          mentors={mentorsInList}
        />
      </div>
    );
  }
}

export default App;
