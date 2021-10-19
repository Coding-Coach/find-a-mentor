import { useEffect } from 'react';
import classNames from 'classnames';
import './MentorList.css';

import Card from '../Card/Card';
import { Pager } from './Pager';
import { Loader } from '../Loader';
import { report } from '../../ga';
import { useNavigation } from '../../hooks/useNavigation';
import { useFilters } from '../../context/filtersContext/FiltersContext';

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
  const [{ page }] = useFilters();
  const to = page * itemsInPage;
  const from = to - itemsInPage;
  const mentorsInList = mentors.slice(from, to);

  useEffect(() => {
    report('Mentors', 'paging', page);
  }, [page]);

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

  return (
    <>
      <div className="mentors-cards">{mentorsList(mentorsInList)}</div>
      <Pager hasNext={to < mentors.length} />
    </>
  );
};

export default MentorsList;
