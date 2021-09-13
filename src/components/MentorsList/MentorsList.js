import { useState } from 'react';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';
import './MentorList.css';

import Card from '../Card/Card';
import { Loader } from '../Loader';
import { report } from '../../ga';
import { useNavigation } from '../../hooks/useNavigation';

const itemsInPage = 20;

const MentorsList = ({ onFavMentor, mentors, favorites, ready, className }) => {
  const { navigateToUser } = useNavigation();

  const onAvatarClick = (mentor) => {
    navigateToUser(mentor);
  };

  const getContent = () => {
    if (!ready) {
      return <Loader size={2} />;
    }
    if (!mentors.length) {
      return (
        <div className="nothing-to-show">
          ¯\_(ツ)_/¯ Wow, we can't believe it. We have nothing for you!
        </div>
      );
    }

    return (
      <Cards
        mentors={mentors}
        favorites={favorites}
        onAvatarClick={onAvatarClick}
        onFavMentor={onFavMentor}
      />
    );
  };

  return (
    <section
      className={classNames(['mentors-wrapper', className])}
      data-testid="mentors-wrapper"
    >
      {getContent()}
    </section>
  );
};

const Cards = ({ mentors, favorites, onFavMentor, onAvatarClick }) => {
  const [page, setPage] = useState(1);
  const mentorsInList = mentors.slice(0, page * itemsInPage);

  const mentorsList = () => {
    return mentorsInList.map((mentor) => (
      <Card
        key={mentor._id}
        mentor={mentor}
        onFavMentor={onFavMentor}
        isFav={favorites.indexOf(mentor._id) > -1}
        onAvatarClick={() => onAvatarClick(mentor)}
      />
    ));
  };

  const loadMore = () => {
    setPage(page + 1);
    report('Mentors', 'load more', page + 1);
  };

  return (
    // TODO: InfiniteScroll trigger re-render the entire app. Need to check if there is a way to avoid this or
    // that we can implement this by ourselves
    <InfiniteScroll
      className="mentors-cards"
      loadMore={loadMore}
      hasMore={mentorsInList.length < mentors.length}
    >
      {mentorsList(mentorsInList)}
    </InfiniteScroll>
  );
};

export default MentorsList;
