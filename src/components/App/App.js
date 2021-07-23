import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tippy/dist/tippy.css';

import { useCallback, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { ToastContainer } from 'react-toastify';
import MentorsList from '../MentorsList/MentorsList';
import Header from '../Header/Header';
import Modal from '../Modal/Modal';
import {
  toggleFavMentor,
  get as getFavorites,
  readFavMentorsFromLocalStorage,
  updateFavMentorsForUser,
} from '../../favoriteManager';
import { set } from '../../titleGenerator';
import { report, reportPageView } from '../../ga';
import { getMentors } from '../../api';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import { useFilterParams } from '../../utils/permaLinkService';
import { useParams, withRouter } from 'react-router';
import { useUser } from '../../context/userContext/UserContext';
import { ActionsHandler } from './ActionsHandler';
import { toast } from 'react-toastify';
import { Sidebar } from '../Sidebar/Sidebar';

const App = () => {
  const params = useParams();
  const { getFilterParams } = useFilterParams();
  const [mentors, setMentors] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [filters, setFilters] = useFilters();
  const { tag, country, name, language, showFavorites, showFilters } = filters;
  const [favorites, setFavorites] = useState([]);
  const { currentUser } = useUser();
  const [modal, setModal] = useState({
    title: null,
    content: null,
    onClose: null,
  });

  useEffect(() => {
    window.onpopstate = () => {
      const urlFilters = getFilterParams();
      setFilters({ type: 'setFilters', payload: urlFilters });
    };
  }, [setFilters, getFilterParams]);

  useEffect(() => {
    if (process.env.REACT_APP_MAINTENANCE_MESSAGE) {
      toast.warn(
        <div
          dangerouslySetInnerHTML={{
            __html: process.env.REACT_APP_MAINTENANCE_MESSAGE,
          }}
        />,
        {
          autoClose: false,
        }
      );
    }
  }, []);

  const filterMentors = useCallback(
    (mentor) => {
      const { tag, country, name, language } = filters;
      return (
        (!tag || mentor.tags.includes(tag)) &&
        (!country || mentor.country === country) &&
        (!name || mentor.name === name) &&
        (!language ||
          (mentor.spokenLanguages &&
            mentor.spokenLanguages.includes(language))) &&
        (!showFavorites || favorites.indexOf(mentor._id) > -1) &&
        mentor.available
      );
    },
    [filters, favorites, showFavorites]
  );

  const onFavMentor = async (mentor) => {
    const newFavorites = toggleFavMentor(mentor, [...favorites]);
    setFavorites(newFavorites);
    report('Favorite');
  };

  useEffect(
    () => set({ tag, country, name, language }),
    [tag, country, name, language]
  );

  const initialize = useCallback(async () => {
    reportPageView();
    const favMentorsFromLocalStorage = readFavMentorsFromLocalStorage();
    Promise.all([
      currentUser &&
        getFavorites().then((favorites) => {
          if (
            Array.isArray(favMentorsFromLocalStorage) &&
            favMentorsFromLocalStorage.length > 0
          ) {
            const mentors = favMentorsFromLocalStorage.filter(
              (m) => !favorites.includes(m)
            );
            if (mentors.length > 0) updateFavMentorsForUser(mentors);
          }
          setFavorites([
            ...new Set([...favMentorsFromLocalStorage, ...favorites]),
          ]);
        }),
      getMentors()
        .then(setMentors)
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e);
        }),
    ]).then(() => {
      setIsReady(true);
    });
  }, [currentUser]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleModal = (title, content, onClose) => {
    setModal({
      title,
      content,
      onClose,
    });
    report('Modal', 'open', title);
  };

  const filteredMentors = useMemo(
    () => mentors.filter(filterMentors),
    [mentors, filterMentors]
  );

  const mentorsInList =
    params.id && isReady
      ? [mentors.find(({ _id }) => _id === params.id)]
      : filteredMentors;

  return (
    <div className="app">
      <ToastContainer />
      <Modal title={modal.title}>{modal.content}</Modal>
      <Main>
        <Header />
        <Content>
          <Sidebar mentors={mentors} handleModal={handleModal} />
          <MentorsList
            className={classNames({
              active: showFilters,
            })}
            mentors={mentorsInList}
            favorites={favorites}
            onFavMentor={onFavMentor}
            ready={isReady}
          />
        </Content>
      </Main>
    </div>
  );
};

const AppWithActionHandlers = withRouter(() => (
  <ActionsHandler>
    <App />
  </ActionsHandler>
));

const Main = styled.main`
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  @media all and (max-width: 800px) {
    flex-direction: column;
  }
`;

export default AppWithActionHandlers;
