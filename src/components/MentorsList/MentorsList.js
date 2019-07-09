import React, { Component } from 'react';

import InfiniteScroll from 'react-infinite-scroller';

import Card from '../Card/Card';

import './MentorList.css';

const itemsInPage = 20;

export default class MentorsList extends Component {
  state = {
    page: 1,
  };

  loadMore = () => {
    this.setState({
      page: this.state.page + 1,
    });
  };

  componentWillReceiveProps(newProps) {
    if (newProps.mentors !== this.props.mentors) {
      this.setState({
        page: 1,
      });
    }
  }

  render() {
    const {
      mentors,
      favorites,
      onFavMentor,
      handleTagClick,
      handleCountryClick,
    } = this.props;
    const { page } = this.state;

    const mentorsInList = mentors.slice(0, page * itemsInPage);

    return (
      <InfiniteScroll
        className="mentors-cards"
        loadMore={this.loadMore}
        hasMore={mentorsInList.length < mentors.length}
      >
        {mentorsInList.map(mentor => (
          <Card
            key={mentor.id}
            mentor={mentor}
            onFavMentor={onFavMentor}
            isFav={favorites.indexOf(mentor.id) > -1}
            handleTagClick={handleTagClick}
            handleCountryClick={handleCountryClick}
          />
        ))}
        {mentorsInList.length === 0 && (
          <div className="nothing-to-show">
            ¯\_(ツ)_/¯ Wow, we can't believe it. We have nothing for you!
          </div>
        )}
      </InfiniteScroll>
    );
  }
}
