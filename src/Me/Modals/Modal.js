import React from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import { desktop } from '../styles/shared/devices';
const ModalContainer = styled.div`
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  position: fixed;
  background-color: #fff;
  display: flex;
  flex-direction: column;
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

export const Modal = ({ closeModal, onSave, title, children }) => (
  <ModalContainer>
    <CloseIconButton onClick={closeModal}>x</CloseIconButton>
    <ContentContainer>
      <Title>{title || null}</Title>
      {children}
    </ContentContainer>
    <Footer>
      <ButtonBar>
        <Button skin="primary" onClick={onSave}>
          Save
        </Button>
        <Button skin="secondary" onClick={closeModal}>
          Close
        </Button>
      </ButtonBar>
    </Footer>
  </ModalContainer>
);
