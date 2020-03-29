import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';
import Card from '../Card/Card';

import './MentorList.css';
import { Loader } from '../Loader';
import { report } from '../../ga';

const itemsInPage = 20;

const MentorsList = props => {
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPage(1);
    setReady(props.ready);
  }, [props.mentors, props.ready]);

  const loadMore = () => {
    setPage(page + 1);
    report('Mentors', 'load more', page + 1);
  };

  const { mentors, className } = props;
  const mentorsInList = mentors.slice(0, page * itemsInPage);

  const mentorsList = () => {
    const { favorites, onFavMentor } = props;

    return mentorsInList.map((mentor, index) => (
      <Card
        key={`${mentor._id}-${index}`}
        mentor={mentor}
        onFavMentor={onFavMentor}
        isFav={favorites.indexOf(mentor._id) > -1}
      />
    ));
  };

  const nothingToShow = hasMentors => {
    return (
      ready &&
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
        hasMore={mentorsInList.length < mentors.length}
      >
        {mentorsList(mentorsInList)}
        {!ready && <Loader />}
        {nothingToShow(!!mentorsInList.length)}
      </InfiniteScroll>
    </section>
  );
};

export default MentorsList;
