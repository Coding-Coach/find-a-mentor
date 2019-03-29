import "./MentorList.css";

import React, { Component } from "react";

import classNames from "classnames";
import InfiniteScroll from "react-infinite-scroller";
import { toggle, get } from "../../favoriteManager";
import Card from "../Card/Card";

const itemsInPage = 10;

export default class MentorsLists extends Component {
  state = {
    page: 1,
    favs: get()
  };

  loadMore = () => {
    this.setState({
      page: this.state.page + 1
    });
  };

  componentWillReceiveProps(newProps) {
    if (newProps.mentors !== this.props.mentors) {
      this.setState({
        page: 1
      });
    }
  }

  onToggleFav = mentor => {
    const favs = toggle(mentor);
    this.setState({
      favs
    });
  };

  render() {
    const { mentors, className } = this.props;
    const { page, favs } = this.state;

    const mentorsInList = mentors.slice(0, page * itemsInPage);

    return (
      <section className={classNames(["mentors-wrapper", className])}>
        <InfiniteScroll
          className="mentors-cards"
          loadMore={this.loadMore}
          hasMore={mentorsInList.length < mentors.length}
        >
          {mentorsInList.map(mentor => (
            <Card
              key={mentor.id}
              mentor={mentor}
              onToggleFav={this.onToggleFav}
              isFav={favs.indexOf(mentor.id) > -1}
            />
          ))}
          {mentorsInList.length === 0 && (
            <div className="nothing-to-show">
              ¯\_(ツ)_/¯ Wow, we can't believe it. We have nothing for you!
            </div>
          )}
        </InfiniteScroll>
      </section>
    );
  }
}
