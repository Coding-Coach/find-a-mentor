import React from 'react';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';
import Card from '../Card/Card';

import './MentorList.css';
import { Loader } from '../Loader';

const MentorsList = ({
  mentors,
  className,
  pagination,
  favorites,
  onFavMentor,
  getMentorsPage,
  handleTagClick,
  handleCountryClick,
}) => {
  const loadMore = async page => {
    await getMentorsPage(page);
  };

  const mentorsList = () => {
    return mentors.map((mentor, index) => (
      <Card
        key={`${mentor._id}-${index}`}
        mentor={mentor}
        onFavMentor={onFavMentor}
        isFav={favorites.indexOf(mentor._id) > -1}
        handleTagClick={handleTagClick}
        handleCountryClick={handleCountryClick}
      />
    ));
  };

  const nothingToShow = hasMentors => {
    return (
      !hasMentors && (
        <div className="nothing-to-show">
          ¯\_(ツ)_/¯ Wow, we can't believe it. We have nothing for you!
        </div>
      )
    );
  };

  return (
    <section
      className={classNames(['mentors-wrapper', className])}
      data-testid="mentors-wrapper"
    >
      <InfiniteScroll
        className="mentors-cards"
        loadMore={loadMore}
        hasMore={pagination.hasMore}
        loader={
          <div className="loader-wrapper" key={'loader'}>
            <Loader />
          </div>
        }
        pageStart={0}
      >
        {mentorsList(mentors)}
        {nothingToShow(pagination.mentorCount === 0 && !pagination.hasMore)}
      </InfiniteScroll>
    </section>
  );
};

export default MentorsList;
