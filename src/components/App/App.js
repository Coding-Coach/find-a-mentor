import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tippy/dist/tippy.css';

import { useCallback, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { ToastContainer } from 'react-toastify';
import MentorsList from '../MentorsList/MentorsList';
import Filter from '../Filter/Filter';
import SocialLinks from '../SocialLinks/SocialLinks';
import Header from '../Header/Header';
import Modal from '../Modal/Modal';
import ModalContent from '../Modal/ModalContent';
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

function scrollToTop() {
  const scrollDuration = 200;
  return new Promise((resolve) => {
    const scrollStep = -window.scrollY / (scrollDuration / 15),
      scrollInterval = setInterval(function () {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
          resolve();
        }
      }, 15);
  });
}

const App = () => {
  const params = useParams();
  const { getFilterParams } = useFilterParams();
  const [mentors, setMentors] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [filters, setFilters] = useFilters();
  const { tag, country, name, language } = filters;
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [fieldsIsActive, setFieldsIsActive] = useState(false);
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

  const toggleFields = () => {
    setFieldsIsActive((fieldsIsActive) => !fieldsIsActive);
  };

  const toggleSwitch = async (showFavorite) => {
    await scrollToTop();
    setShowFavorites(showFavorite);
    report('Show Favorite', 'switch', showFavorite);
  };

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
          <aside className="sidebar">
            <Filter
              onToggleFilter={toggleFields}
              onToggleSwitch={toggleSwitch}
              mentorCount={filteredMentors.length}
              mentors={filteredMentors}
              showFavorite={showFavorites}
            />
            <SocialLinks />
            <nav className="sidebar-nav">
              <ModalContent
                policyTitle={'Cookies policy'}
                content={'cookies-policy'}
                handleModal={(title, content) => handleModal(title, content)}
              />
              <ModalContent
                policyTitle={'Code of Conduct'}
                content={'code-conduct'}
                handleModal={(title, content) => handleModal(title, content)}
              />
              <ModalContent
                policyTitle={'Terms & Conditions'}
                content={'terms-conditions'}
                handleModal={(title, content) => handleModal(title, content)}
              />
              <ModalContent
                policyTitle={'Privacy Statement'}
                content={'privacy-policy'}
                handleModal={(title, content) => handleModal(title, content)}
              />
            </nav>
            <a
              href="https://www.patreon.com/codingcoach_io"
              className="patreon-link"
              aria-label="Become a Patreon. A Patreon is a person who helps economically a project he or she believes in."
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/coding-coach-patron-button.jpg`}
                alt="Become a Patron"
              />
            </a>
          </aside>
          <MentorsList
            className={classNames({
              active: fieldsIsActive,
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
