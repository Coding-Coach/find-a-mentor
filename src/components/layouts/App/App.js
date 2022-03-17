import { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { toast, ToastContainer } from 'react-toastify';

import Header from '../../Header/Header';
import Modal from '../../Modal/Modal';
import { set as setWindowTitle } from '../../../titleGenerator';
import { report } from '../../../ga';
import { useFilters } from '../../../context/filtersContext/FiltersContext';
import { ActionsHandler } from './ActionsHandler';
import { desktop, mobile } from '../../../Me/styles/shared/devices';
import { Sidebar } from '../../Sidebar/Sidebar';
import { useMentors } from '../../../context/mentorsContext/MentorsContext';

const App = (props) => {
  const { children } = props;
  const [filters] = useFilters();
  const { tag, country, name, language, showFilters } = filters;
  const [modal, setModal] = useState({
    title: null,
    content: null,
    onClose: null,
  });
  const { mentors } = useMentors();

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

  useEffect(
    () => setWindowTitle({ tag, country, name, language }),
    [tag, country, name, language]
  );

  const handleModal = (title, content, onClose) => {
    setModal({
      title,
      content,
      onClose,
    });
    report('Modal', 'open', title);
  };

  return (
    <div className="app">
      <ToastContainer />
      <Modal title={modal.title}>{modal.content}</Modal>
      <Layout>
        <Header />
        <Body>
          <Sidebar mentors={mentors} handleModal={handleModal} />
          <Main showFilters={showFilters}>{children}</Main>
        </Body>
      </Layout>
    </div>
  );
};

const AppWithActionHandlers = (props) => (
  <ActionsHandler>
    <App {...props} />
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

    ${(props) =>
      props.showFilters &&
      `
        transform: translateY(300px);
        margin-bottom: 50px;
      `}
  }
`;

export default AppWithActionHandlers;
