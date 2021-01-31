import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import _Button from '../components/Button';
import { desktop } from '../styles/shared/devices';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as CloseSvg } from '../../assets/me/close.svg';

const Button = styled(_Button)`
  margin: 0;
  & + & {
    margin-left: 1rem;
  }
`;

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
  // padding: 20px;

  @media ${desktop} {
    height: 70%;
  }
`;

const Title = styled.header`
  width: 100%;
  color: #4f4f4f;
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
const Center = css`
  left: 50%;
  top: 50%;
  height: auto;
  width: auto;
  box-shadow: 0 0 4px 0 rgba(17, 22, 26, 0.16),
    0 2px 4px 0 rgba(17, 22, 26, 0.08), 0 4px 8px 0 rgba(17, 22, 26, 0.08);

  ${Footer} {
    position: relative;
    padding-bottom: 46px;
  }
`;

const Cover = css`
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
`;

const ModalContainer = styled.div`
z-index: 99;
font-family: 'Lato', sans-serif;
display: flex;
position: fixed;
background-color: #fff;
flex-direction: column;
padding: 0 45px;
${Cover}
@media ${desktop} {
  ${props => (props.posCenter ? Center : Cover)}
}
`;

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
    opacity: 0;
    transition: opacity 200ms, transform 200ms ease;
  }

`}</style>
);

const transitionCenter = (
  <style>{`
    @media ${desktop} {
    .modal-exit,
    .modal-enter {
      transform: scale(.8) translate(calc(-50%), -60%);
    }
    .modal-enter-active,
    .modal-enter-done {
      /* INFO: Taking sidenav into account (75px) */
        transform: translate(calc(-50% + 75px/2), -50%);
        transition-timing-function: cubic-bezier(0.18, 0.89, 0.04, 1.4)
      }
    }
  `}</style>
);

export const Modal = ({
  closeModal,
  onSave,
  title,
  submitLabel = 'Save',
  center,
  isValid = true,
  children,
}) => {
  const [state, setState] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const save = () => {
    setLoadingState(isValid);
    onSave();
  };

  useEffect(() => {
    if (!isValid) setLoadingState(isValid);
  }, [isValid]);

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
        onExited={closeModal}
      >
        <ModalContainer posCenter={center}>
          <CloseIconButton onClick={() => setState(false)}>
            <CloseSvg />
          </CloseIconButton>
          <ContentContainer>
            <Title>{title || null}</Title>
            {children}
          </ContentContainer>
          <Footer>
            <ButtonBar>
              {onSave && (
                <Button
                  skin="primary"
                  onClick={save}
                  isLoading={loadingState}
                  disabled={loadingState}
                >
                  {submitLabel}
                </Button>
              )}
              <Button skin="secondary" onClick={() => setState(false)}>
                Close
              </Button>
            </ButtonBar>
          </Footer>
        </ModalContainer>
      </CSSTransition>
    </>
  );
};
