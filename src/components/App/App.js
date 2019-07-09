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
import TechnologyInput from '../TechnologyInput/TechnologyInput';
import shuffle from 'lodash/shuffle';
import { toggle, get } from '../../favoriteManager';
import { set } from '../../titleGenerator';
import { report, reportPageView } from '../../ga';

import { generateLists } from '../../listsGenerator';
const { tags: allTags, countries, names, languages } = generateLists(mentors);

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
    tags: new Set(),
    technology: '',
    country: '',
    name: '',
    language: '',
  };

  handleTagSelect = async ({ value: tag }) => {
    await scrollToTop();
    this.setState(state => ({
      tags: new Set(state.tags).add(tag),
      technology: '',
    }));
    this.setPermalinkParams('technology', tag);
    report('Filter', 'tag', tag);
  };

  handleTagRemove = ({ value: tag }) => {
    this.setState(
      state => {
        const newTags = new Set(state.tags);
        newTags.delete(tag);
        return {
          tags: newTags,
        };
      },
      () => this.setPermalinkParams('technology', tag)
    );
  };

  handleCountrySelect = async ({ value: country }) => {
    await scrollToTop();
    this.setState({
      country,
    });
    this.setPermalinkParams('country', country);
    report('Filter', 'country', country);
  };

  handleNameSelect = async ({ value: name }) => {
    await scrollToTop();
    this.setState({
      name,
    });
    this.setPermalinkParams('name', name);
    report('Filter', 'name', 'name');
  };

  handleLanguageSelect = async ({ value: language }) => {
    await scrollToTop();
    this.setState({
      language,
    });
    this.setPermalinkParams('language', language);
    report('Filter', 'language', language);
  };

  filterMentors = mentor => {
    const {
      tags,
      country,
      name,
      language,
      showFavorite,
      favorites,
    } = this.state;
    return (
      (!tags.size ||
        mentor.tags.filter(mentorTag => tags.has(mentorTag)).length > 0) &&
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
    this.setPermalinkParams('technology', clickedTag);
    report('Filter', 'tag', clickedTag);
  };

  handleCountryClick = async clickedCountry => {
    await scrollToTop();
    this.setState({
      clickedCountry,
    });
    this.setPermalinkParams('country', clickedCountry);
    report('Filter', 'country', clickedCountry);
  };

  getPermalinkParams() {
    const permalink = new URLSearchParams(window.location.search);

    const technologies = permalink.get('technology') || '';

    this.setState({
      tags: new Set(technologies ? technologies.split(',') : null),
      country: permalink.get('country') || '',
      name: permalink.get('name') || '',
      language: permalink.get('language') || '',
    });
  }

  setPermalinkParams = (param, value) => {
    const sources = {
      technology: allTags,
      name: names,
      language: languages,
      country: countries,
    };
    const source = sources[param];

    const permalink = new URLSearchParams(window.location.search);
    const paramItem = source.filter(item => item.label === value);

    if (paramItem.length && value.length) {
      // Special case for "technology" because of multiple inputs available
      if (param === 'technology') {
        const technologies = Array.from(this.state.tags).join(',');

        if (!technologies) permalink.delete(param);
        else permalink.set(param, technologies);
      } else {
        permalink.set(param, paramItem[0].value);
      }
    } else if (!value.length) {
      permalink.delete(param);
    }
    window.history.pushState({}, null, '?' + permalink.toString());
  };

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
      tags,
      mentors,
      fieldsIsActive,
      modal,
      clickedTag,
      clickedCountry,
      technology,
      country,
      language,
      name,
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
              onCountrySelected={this.handleCountrySelect}
              onCountryChanged={e => this.setState({ country: e.target.value })}
              onNameSelected={this.handleNameSelect}
              onNameChanged={e => this.setState({ name: e.target.value })}
              onLanguageSelected={this.handleLanguageSelect}
              onLanguageChanged={e =>
                this.setState({ language: e.target.value })
              }
              onToggleFilter={this.toggleFields}
              onToggleSwitch={this.toggleSwitch}
              mentorCount={mentorsInList.length}
              clickedTag={clickedTag}
              clickedCountry={clickedCountry}
              country={country}
              countries={countries}
              name={name}
              names={names}
              language={language}
              languages={languages}
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
                src={`${
                  process.env.PUBLIC_URL
                }/images/coding-coach-patron-button.jpg`}
                alt="Become a Patron"
              />
            </a>
          </aside>

          <section
            className={classNames([
              'mentors-wrapper',
              {
                active: fieldsIsActive,
              },
            ])}
            data-testid="mentors-wrapper"
          >
            <TechnologyInput
              tags={allTags}
              clickedTag={clickedTag}
              selectedTags={Array.from(tags)}
              value={technology}
              onTagChanged={e => this.setState({ technology: e.target.value })}
              onTagSelected={this.handleTagSelect}
              onTagRemoved={this.handleTagRemove}
            />

            <MentorsList
              mentors={mentorsInList}
              favorites={this.state.favorites}
              onFavMentor={this.onFavMentor}
              handleTagClick={this.handleTagClick}
              handleCountryClick={this.handleCountryClick}
            />
          </section>
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
