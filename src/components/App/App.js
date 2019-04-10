import './App.css';
import mentors from '../../mentors.json';

import React, { Component } from 'react';
import classNames from 'classnames';
import MentorsList from '../MentorsList/MentorsList';
import Filter from '../Filter/Filter';
import Content from '../Content/Content';
import Logo from '../Logo';
import SocialLinks from '../SocialLinks/SocialLinks';
import Modal from '../Modal/Modal';
import shuffle from 'lodash/shuffle';
import { toggle, get } from '../../favoriteManager';



// const serverEndpoint = 'http://localhost:3001';
class App extends Component {
  state = {
    mentors: shuffle(mentors),
    favorites: get(),
    modal: {
      content: null,
      onClose: null
    }
  };

  handleTagSelect = async ({ value: tag }) => {
    await scrollToTop();
    this.setState({
      tag,
    });
  };

  handleCountrySelect = async ({ value: country }) => {
    await scrollToTop();
    this.setState({
      country,
    });
  };

  handleNameSelect = async ({ value: name }) => {
    await scrollToTop();
    this.setState({
      name,
    });
  };

  filterMentors = mentor => {
    const { tag, country, name, showFavorite, favorites } = this.state;
    return (
      (!tag || mentor.tags.includes(tag)) &&
      (!country || mentor.country === country) &&
      (!name || mentor.name === name) &&
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
  };

  onFavMentor = mentor => {
    const favorites = toggle(mentor);
    this.setState({
      favorites,
    });
  };

  openModal = (content, onClose) => {
    this.setState({
      modal: {
        content,
        onClose
      }
    })
  }

  closeModal = () => {
    const { modal: { onClose } } = this.state;

    if (typeof onClose === 'function') {
      onClose();
    }
  }

  componentDidMount() {
    if (window && window.ga) {
      const { location, ga } = window;
      ga('set', 'page', location.href);
      ga('send', 'pageview');
    }
  }

  render() {
    const { mentors, fieldsIsActive, modal } = this.state;
    const mentorsInList = mentors.filter(this.filterMentors);

    return (
      <div className="app">
        <Modal onClose={this.closeModal}>
          {modal.content}
        </Modal>
        <main>
          <aside className="sidebar">
            <a className="logo" href="/">
              <Logo width={110} height={50} color="#68d5b1" />
            </a>
            <Filter
              onTagSelected={this.handleTagSelect}
              onCountrySelected={this.handleCountrySelect}
              onNameSelected={this.handleNameSelect}
              onToggleFilter={this.toggleFields}
              onToggleSwitch={this.toggleSwitch}
              mentorCount={mentorsInList.length}
            />
            <SocialLinks />
            <ul className="sidebar-nav">
              <li onClick={()=>this.openModal(<Content topic="cookies-policy" />)}>
                Cookies Policy
              </li>
              <li onClick={()=>this.openModal(<Content topic="code-conduct" />)}>
                Code of Conduct
              </li>
              <li onClick={()=>this.openModal(<Content topic="terms-conditions" />)}>
                Terms & Conditions
              </li>
              <li onClick={()=>this.openModal(<Content topic="privacy-policy" />)}>
                Privacy Statement
              </li>
            </ul>
          </aside>
          <MentorsList
            className={classNames({
              active: fieldsIsActive,
            })}
            mentors={mentorsInList}
            favorites={this.state.favorites}
            onFavMentor={this.onFavMentor}
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
