import React from 'react';
import classNames from 'classnames';

import Card from '../Card/Card';
import { Pager } from './Pager';
import { Loader } from '../Loader';
import { report } from '../../ga';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import { useMentors } from '../../context/mentorsContext/MentorsContext';

const itemsInPage = 20;

const MentorsList = () => {
  const { mentors, favorites, addFavorite, isLoading } = useMentors();

  const getContent = () => {
    if (isLoading) {
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
        onFavMentor={addFavorite}
      />
    );
  };

  return (
    <section
      className={classNames(['mentors-wrapper'])}
      data-testid="mentors-wrapper"
    >
      {getContent()}
    </section>
  );
};

const Cards = ({ mentors, favorites, onFavMentor }) => {
  const [{ page }] = useFilters();
  const to = page * itemsInPage;
  const from = to - itemsInPage;
  const mentorsInList = mentors.slice(from, to);

  React.useEffect(() => {
    report('Mentors', 'paging', page);
  }, [page]);

  const mentorsList = () => {
    return mentorsInList.map((mentor) => (
      <Card
        key={mentor._id}
        mentor={mentor}
        onFavMentor={onFavMentor}
        isFav={favorites.indexOf(mentor._id) > -1}
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
