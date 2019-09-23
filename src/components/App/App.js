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
import { toggle, get } from '../../favoriteManager';
//import { set } from '../../titleGenerator';
import { report, reportPageView } from '../../ga';
import { getMentors } from '../../api';
import { ToastContainer } from 'react-toastify';
import { getCurrentUser } from '../../api';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import UserContext from '../../context/userContext/UserContext';
import { setPermalinkParams } from '../../utils/permaLinkService';

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
  const [filters] = useFilters();
  const { tag } = filters;
  const [favorites, setFavorites] = useState(get());
  const [fieldsIsActive, setFieldsIsActive] = useState(true);
  const { updateUser } = useContext(UserContext);
  const [modal, setModal] = useState({
    title: null,
    content: null,
    onClose: null,
  });

  const handleTagSelect = useCallback(async ({ value: tag }) => {
    await scrollToTop();
    report('Filter', 'tag', tag);
  }, []);

  const handleCountrySelect = useCallback(async ({ value: country }) => {
    await scrollToTop();
    report('Filter', 'country', country);
  }, []);

  const handleNameSelect = useCallback(async () => {
    await scrollToTop();
    //this one is different, we don't want to store any private data
    report('Filter', 'name', 'name');
  }, []);

  const handleLanguageSelect = useCallback(async ({ value: language }) => {
    await scrollToTop();
    report('Filter', 'language', language);
  }, []);

  const filterMentors = useCallback(
    mentor => {
      const { tag, country, name, language, showFavorite } = filters;
      return (
        (!tag || mentor.tags.includes(tag)) &&
        (!country || mentor.country === country) &&
        (!name || mentor.name === name) &&
        (!language ||
          (mentor.spokenLanguages &&
            mentor.spokenLanguages.includes(language))) &&
        (!showFavorite || favorites.indexOf(mentor._id) > -1)
      );
    },
    [filters, favorites]
  );

  const toggleFields = () => {
    setFieldsIsActive(fieldsIsActive => !fieldsIsActive);
  };

  const toggleSwitch = async showFavorite => {
    await scrollToTop();
    report('Show Favorite', 'switch', showFavorite);
  };

  const onFavMentor = mentor => {
    const favorites = toggle(mentor);
    setFavorites(favorites);
    report('Favorite');
  };

  const handleTagClick = async clickedTag => {
    await scrollToTop();
    report('Filter', 'tag', clickedTag);
  };

  const handleAvatarClick = async clickedUser => {
    await scrollToTop();
    report('Filter', 'name', clickedUser);
  };

  const handleCountryClick = async clickedCountry => {
    await scrollToTop();
    report('Filter', 'country', clickedCountry);
  };

  useEffect(() => {
    setPermalinkParams('technology', tag);
  }, [tag]);

  /*
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    set(nextState);
  }
*/

  useEffect(() => {
    async function initialize() {
      reportPageView();
      const mentors = await getMentors();
      const currentUser = await getCurrentUser();
      updateUser(currentUser);
      setMentors(mentors);
      setIsReady(true);
    }
    initialize();
  }, [updateUser]);

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
              onTagSelected={handleTagSelect}
              onCountrySelected={handleCountrySelect}
              onNameSelected={handleNameSelect}
              onLanguageSelected={handleLanguageSelect}
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
            handleTagClick={handleTagClick}
            handleAvatarClick={handleAvatarClick}
            handleCountryClick={handleCountryClick}
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
