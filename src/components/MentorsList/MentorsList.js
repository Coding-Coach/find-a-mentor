import React, { Component } from 'react';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';

import Card from '../Card/Card';

import './MentorList.css';
import { Loader } from '../Loader';

const itemsInPage = 20;

export default class MentorsList extends Component {
  state = {
    page: 1,
    ready: false,
  };

  loadMore = () => {
    this.setState({
      page: this.state.page + 1,
    });
  };

  componentWillReceiveProps(newProps) {
    const { mentors, ready } = this.props;
    if (newProps.mentors !== mentors || newProps.ready !== ready) {
      this.setState({
        page: 1,
        ready: newProps.ready,
      });
    }
  }

  mentorsList(mentorsInList) {
    const {
      favorites,
      onFavMentor,
      handleTagClick,
      handleCountryClick,
    } = this.props;

    return mentorsInList.map((mentor, index) => (
      <Card
        key={`${mentor.id}-${index}`}
        mentor={mentor}
        onFavMentor={onFavMentor}
        isFav={favorites.indexOf(mentor.id) > -1}
        handleTagClick={handleTagClick}
        handleCountryClick={handleCountryClick}
      />
    ))
  }

  nothingToShow(hasMentors) {
    const { ready } = this.state;
    return ready && !hasMentors && (
      <div className="nothing-to-show">
        ¯\_(ツ)_/¯ Wow, we can't believe it. We have nothing for you!
      </div>
    )
  }

  render() {
    const {
      mentors,
      className,
    } = this.props;
    const { page, ready } = this.state;
    const mentorsInList = mentors.slice(0, page * itemsInPage);

    return (
      <section
        className={classNames(['mentors-wrapper', className])}
        data-testid="mentors-wrapper"
      >
        <InfiniteScroll
          className="mentors-cards"
          loadMore={this.loadMore}
          hasMore={mentorsInList.length < mentors.length}
        >
          {this.mentorsList(mentorsInList)}
          {!ready && <Loader />}
          {this.nothingToShow(!!mentorsInList.length)}
        </InfiniteScroll>
      </section>
    );
  }
}
