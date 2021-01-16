import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import { desktop } from '../styles/shared/devices';
import { CSSTransition } from 'react-transition-group';

const CloseIconButton = styled.button`
  background-color: transparent;
  color: #000;
  font-weight: 500;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  width: 28px;
  height: 28px;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  height: 80%;
  width: 100%;
  margin: 0 auto;
  overflow-y: auto;
  padding: 20px;

  @media ${desktop} {
    height: 70%;
  }
`;

const Title = styled.header`
  width: 100%;
  color: #4f4f4f;
  font-family: Lato;
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
  text-align: center;
  margin: 50px 0;
`;

const Footer = styled.footer`
  position: absolute;
  height: 20%;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media ${desktop} {
    height: 30%;
  }
`;

const ButtonBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media ${desktop} {
    flex-direction: row;
  }
`;
//TODO: Use close icon

const Center = {
  left: '50%',
  top: '50%',
  //INFO: Taking sidenav into account (75px)
  transform: 'translate(calc(-50% + 75px/2), -50%)',
  [Footer]: {
    position: 'relative',
    'padding-bottom': '46px',
  },
};
const Cover = {
  height: '100vh',
  width: '100vw',
  top: 0,
  left: 0,
};

const ModalContainer = styled.div(props => {
  const style = props.posCenter ? Center : Cover;
  return {
    ...style,
    position: 'fixed',
    'background-color': '#fff',
    display: 'flex',
    'flex-direction': 'column',
  };
});

const transitionStyle = (
  <style>{`
  .modal-enter {
    opacity: 0;
    transform: scale(.9)
  }
  .modal-enter-active {
    opacity: 1;
    transition: opacity 250ms, transform 250ms;
    transform: scale(1)

  }
  .modal-exit {
    opacity: 1;
  }
  .modal-exit-active {
    opacity: 0;
    transition: opacity 250ms, transform 250ms;
  }
  
`}</style>
);

const transitionCenter = (
  <style>{`
    .modal-enter {
      transform: scale(.8) translate(calc(-50%), -60%)
    }
    .modal-enter-active {
        transform: translate(calc(-50% + 75px/2), -50%)
      }

    `}</style>
);

export const Modal = ({ closeModal, onSave, title, center, children }) => {
  const [state, setState] = useState(false);
  useEffect(() => {
    setState(true);
  }, []);

  return (
    <>
      {transitionStyle}
      {center && transitionCenter}

      <CSSTransition
        in={state}
        timeout={250}
        classNames="modal"
        mountOnEnter
        unmountOnExit
        // onEnter={() => setShowButton(false)}
        onExited={closeModal}
      >
        <ModalContainer posCenter={center}>
          <CloseIconButton onClick={closeModal}>x</CloseIconButton>
          <ContentContainer>
            <Title>{title || null}</Title>
            {children}
          </ContentContainer>
          <Footer>
            <ButtonBar>
              {onSave && (
                <Button skin="primary" onClick={onSave}>
                  Save
                </Button>
              )}
              <Button skin="secondary" onClick={closeModal}>
                Close
              </Button>
            </ButtonBar>
          </Footer>
        </ModalContainer>
      </CSSTransition>
    </>
  );
};
