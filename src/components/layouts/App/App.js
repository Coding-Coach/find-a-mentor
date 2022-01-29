import { useCallback, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components/macro';
import { toast, ToastContainer } from 'react-toastify';

import Header from '../../Header/Header';
import Modal from '../../Modal/Modal';
import { set as setWindowTitle } from '../../../titleGenerator';
import { report, reportPageView } from '../../../ga';
import { useFilters } from '../../../context/filtersContext/FiltersContext';
import { useMentors } from '../../../context/mentorsContext/MentorsContext'

import { ActionsHandler } from './ActionsHandler';

import { desktop, mobile } from '../../../Me/styles/shared/devices';
import { Sidebar } from '../../Sidebar/Sidebar';

const App = (props) => {
  const {children} = props
  
  const [filters] = useFilters();
  const { tag, country, name, language, showFavorites, showFilters } = filters;
  const {mentors, favorites} = useMentors()
  
  
  const [modal, setModal] = useState({
    title: null,
    content: null,
    onClose: null,
  });


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

  useEffect(() => setWindowTitle({ tag, country, name, language }), [
    tag,
    country,
    name,
    language,
  ]);

  

  useEffect(() => {
    setWindowTitle({});
    reportPageView()
  }, []);

  const handleModal = (title, content, onClose) => {
    setModal({
      title,
      content,
      onClose,
    });
    report('Modal', 'open', title);
  };

  const mentorsInList = useMemo(() => mentors?.filter(filterMentors), [
    mentors,
    filterMentors,
  ]);

  if (!mentors) {
      return null
  }

  return (
    <div className="app">
      <ToastContainer />
      <Modal title={modal.title}>{modal.content}</Modal>
      <Layout>
        <Header />
        <Body>
          <Sidebar mentors={mentorsInList} handleModal={handleModal} />
          <Main showFilters={showFilters}>
            {children}
          </Main>
        </Body>
      </Layout>
    </div>
  );
};

const AppWithActionHandlers = ({children}) => (
  <ActionsHandler>
    <App>{children}</App>
  </ActionsHandler>
);

const Layout = styled.main`
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  display: flex;
  @media all and (max-width: 800px) {
    flex-direction: column;
  }
`;

const Main = styled.section`
  display: flex;
  justify-content: center;

  @media ${desktop} {
    flex-grow: 1;
    margin-left: 276px;
    padding-bottom: 30px;
  }

  @media ${mobile} {
    background: #fff;
    position: relative;
    transform: translateY(0);
    transition: transform 0.3s ease;

    ${props =>
      props.showFilters &&
      `
        transform: translateY(300px);
        margin-bottom: 50px;
      `}
  }
`;

export default AppWithActionHandlers;
