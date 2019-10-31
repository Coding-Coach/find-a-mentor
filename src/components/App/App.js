import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tippy/dist/tippy.css';

import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useMemo,
} from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import MentorsList from '../MentorsList/MentorsList';
import Filter from '../Filter/Filter';
import SocialLinks from '../SocialLinks/SocialLinks';
import Header from '../Header/Header';
import Modal from '../Modal/Modal';
import ModalContent from '../Modal/ModalContent';
import { toggle, get as getFavorites } from '../../favoriteManager';
import { set } from '../../titleGenerator';
import { report, reportPageView } from '../../ga';
import { getMentors } from '../../api';
import { ToastContainer } from 'react-toastify';
import { getCurrentUser } from '../../api';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import UserContext from '../../context/userContext/UserContext';
import {
  setPermalinkParams,
  getPermalinkParamsValues,
} from '../../utils/permaLinkService';

function scrollToTop() {
  const scrollDuration = 200;
  return new Promise(resolve => {
    const scrollStep = -window.scrollY / (scrollDuration / 15),
      scrollInterval = setInterval(function() {
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
  const [mentors, setMentors] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [filters, setFilters] = useFilters();
  const { tag, country, name, language, onPopState } = filters;
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [fieldsIsActive, setFieldsIsActive] = useState(false);
  const { updateUser } = useContext(UserContext);
  const [modal, setModal] = useState({
    title: null,
    content: null,
    onClose: null,
  });

  useEffect(() => {
    window.onpopstate = () => {
      const urlFilters = getPermalinkParamsValues();
      setFilters({ type: 'setFilters', payload: urlFilters });
    };
  }, [setFilters]);

  const filterMentors = useCallback(
    mentor => {
      const { tag, country, name, language } = filters;
      return (
        (!tag || mentor.tags.includes(tag)) &&
        (!country || mentor.country === country) &&
        (!name || mentor.name === name) &&
        (!language ||
          (mentor.spokenLanguages &&
            mentor.spokenLanguages.includes(language))) &&
        (!showFavorites || favorites.indexOf(mentor._id) > -1)
      );
    },
    [filters, favorites, showFavorites]
  );

  const toggleFields = () => {
    setFieldsIsActive(fieldsIsActive => !fieldsIsActive);
  };

  const toggleSwitch = async showFavorite => {
    await scrollToTop();
    setShowFavorites(showFavorite);
    report('Show Favorite', 'switch', showFavorite);
  };

  const onFavMentor = async mentor => {
    const newFavorites = toggle(mentor, [...favorites]);
    setFavorites(newFavorites);
    report('Favorite');
  };

  const onUpdateFilter = useCallback(
    async (value, param) => {
      if (typeof value === 'undefined') {
        return;
      }
      await scrollToTop();
      if (!onPopState) {
        setPermalinkParams(param, value);
        if (value) {
          report('Filter', param, value);
        }
      }
    },
    [onPopState]
  );

  useEffect(() => {
    onUpdateFilter(tag, 'technology');
  }, [tag, onUpdateFilter]);

  useEffect(() => {
    onUpdateFilter(country, 'country');
  }, [country, onUpdateFilter]);

  useEffect(() => {
    onUpdateFilter(language, 'language');
  }, [language, onUpdateFilter]);

  const onUpdateName = useCallback(async () => {
    if (typeof name === 'undefined') {
      return;
    }
    await scrollToTop();
    if (!onPopState) {
      setPermalinkParams('name', name);
      if (name) {
        report('Filter', 'name', 'name');
      }
    }
  }, [name, onPopState]);

  useEffect(() => {
    onUpdateName();
  }, [name, onUpdateName]);

  useEffect(() => set({ tag, country, name, language }), [
    tag,
    country,
    name,
    language,
  ]);

  useEffect(() => {
    async function initialize() {
      reportPageView();

      const user = await getCurrentUser();
      updateUser(user);

      Promise.all([
        user && getFavorites().then(setFavorites),
        getMentors().then(setMentors),
      ]).then(() => {
        setIsReady(true);
      });
    }
    initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleModal = (title, content, onClose) => {
    setModal({
      title,
      content,
      onClose,
    });
    report('Modal', 'open', title);
  };

  const mentorsInList = useMemo(() => mentors.filter(filterMentors), [
    mentors,
    filterMentors,
  ]);

  return (
    <div className="app">
      <ToastContainer />
      <Modal title={modal.title}>
        {/*onClose={closeModal}*/}
        {modal.content}
      </Modal>

      <Main>
        <Header />
        <Content>
          <aside className="sidebar">
            <Filter
              onToggleFilter={toggleFields}
              onToggleSwitch={toggleSwitch}
              mentorCount={mentorsInList.length}
              mentors={mentorsInList}
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

export default App;
