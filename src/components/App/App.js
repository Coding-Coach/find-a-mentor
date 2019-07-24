import './App.css';
import mentors from '../../mentors.json';

import React, { Component } from 'react';
import classNames from 'classnames';
import MentorsList from '../MentorsList/MentorsList';
import Filter from '../Filter/Filter';
import Logo from '../Logo';
import SocialLinks from '../SocialLinks/SocialLinks';
import Header from '../Header/Header';
import Modal from '../Modal/Modal';
import ModalContent from '../Modal/ModalContent';
import shuffle from 'lodash/shuffle';
import { toggle, get } from '../../favoriteManager';
import { set } from '../../titleGenerator';
import { report, reportPageView } from '../../ga';

// const serverEndpoint = 'http://localhost:3001';
class App extends Component {
  state = {
    mentors: shuffle(mentors),
    favorites: get(),
    modal: {
      title: null,
      content: null,
      onClose: null,
    },
  };

  handleTagSelect = async ({ value: tag }) => {
    await scrollToTop();
    this.setState({
      tag,
    });
    report('Filter', 'tag', tag);
  };

  handleCountrySelect = async ({ value: country }) => {
    await scrollToTop();
    this.setState({
      country,
    });
    report('Filter', 'country', country);
  };

  handleNameSelect = async ({ value: name }) => {
    await scrollToTop();
    this.setState({
      name,
    });
    report('Filter', 'name', 'name');
  };

  handleLanguageSelect = async ({ value: language }) => {
    await scrollToTop();
    this.setState({
      language,
    });
    report('Filter', 'language', language);
  };

  filterMentors = mentor => {
    const {
      tag,
      country,
      name,
      language,
      showFavorite,
      favorites,
    } = this.state;
    return (
      (!tag || mentor.tags.includes(tag)) &&
      (!country || mentor.country === country) &&
      (!name || mentor.name === name) &&
      (!language ||
        (mentor.spokenLanguages &&
          mentor.spokenLanguages.includes(language))) &&
      (!showFavorite || favorites.indexOf(mentor.id) > -1)
    );
  };

  toggleFields = () => {
    this.setState({
      fieldsIsActive: !this.state.fieldsIsActive,
    });
  };

  toggleSwitch = async showFavorite => {
    await scrollToTop();
    this.setState({
      showFavorite,
    });
    report('Show Favorite', 'switch', showFavorite);
  };

  onFavMentor = mentor => {
    const favorites = toggle(mentor);
    this.setState({
      favorites,
    });
    report('Favorite');
  };

  handleTagClick = async clickedTag => {
    await scrollToTop();
    this.setState({
      clickedTag,
    });
    report('Filter', 'tag', clickedTag);
  };

  handleCountryClick = async clickedCountry => {
    await scrollToTop();
    this.setState({
      clickedCountry,
    });
    report('Filter', 'country', clickedCountry);
  };

  getPermalinkParams() {
    const permalink = new URLSearchParams(window.location.search);

    this.setState({
      tag: permalink.get('technology'),
      country: permalink.get('country'),
      name: permalink.get('name'),
      language: permalink.get('language'),
    });
  }

  componentWillUpdate(nextProps, nextState) {
    set(nextState);
  }

  componentDidMount() {
    reportPageView();
    this.getPermalinkParams();
  }

  handleModal = (title, content, onClose) => {
    this.setState({
      modal: {
        title,
        content,
        onClose,
      },
    });
    report('Modal', 'open', title);
  };

  render() {
    const {
      mentors,
      fieldsIsActive,
      modal,
      clickedTag,
      clickedCountry,
    } = this.state;
    const mentorsInList = mentors.filter(this.filterMentors);

    return (
      <div className="app">
        <Modal onClose={this.closeModal} title={modal.title}>
          {modal.content}
        </Modal>

        <main>
          <Header />
          <aside className="sidebar">
            <Logo width={110} height={50} color="#68d5b1" />
            <Filter
              onTagSelected={this.handleTagSelect}
              onCountrySelected={this.handleCountrySelect}
              onNameSelected={this.handleNameSelect}
              onLanguageSelected={this.handleLanguageSelect}
              onToggleFilter={this.toggleFields}
              onToggleSwitch={this.toggleSwitch}
              mentorCount={mentorsInList.length}
              clickedTag={clickedTag}
              clickedCountry={clickedCountry}
              mentors={mentorsInList}
            />
            <SocialLinks />

            <nav className="sidebar-nav">
              <ModalContent
                policyTitle={'Cookies policy'}
                content={'cookies-policy'}
                handleModal={(title, content) =>
                  this.handleModal(title, content)
                }
              />
              <ModalContent
                policyTitle={'Code of Conduct'}
                content={'code-conduct'}
                handleModal={(title, content) =>
                  this.handleModal(title, content)
                }
              />
              <ModalContent
                policyTitle={'Terms & Conditions'}
                content={'terms-conditions'}
                handleModal={(title, content) =>
                  this.handleModal(title, content)
                }
              />
              <ModalContent
                policyTitle={'Privacy Statement'}
                content={'privacy-policy'}
                handleModal={(title, content) =>
                  this.handleModal(title, content)
                }
              />
            </nav>

            <a
              href="https://www.patreon.com/codingcoach_io"
              className="patreon-link"
              aria-label="Become a Patreon. A Patreon is a person who helps economically a project he or she believes in."
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/coding-coach-patron-button.jpg`}
                alt="Become a Patron"
              />
            </a>
          </aside>
          <MentorsList
            className={classNames({
              active: fieldsIsActive,
            })}
            mentors={mentorsInList}
            favorites={this.state.favorites}
            onFavMentor={this.onFavMentor}
            handleTagClick={this.handleTagClick}
            handleCountryClick={this.handleCountryClick}
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
      scrollInterval = setInterval(function() {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
          resolve();
        }
      }, 15);
  });
}
