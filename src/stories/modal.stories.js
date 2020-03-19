import React from 'react';
import { useModal } from '../context/modalContext/ModalContext';
import { ModalHookProvider } from '../context/modalContext/ModalContext';
import { Modal } from '../Me/Modals/Modal';

export default { title: 'Modals' };

const Comp = () => {
  const [openModal] = useModal(<Modal />);
  return (
    <button onClick={openModal}>Open Modal</button>
  )
}

export const Me = () => (
  <ModalHookProvider>
    <Comp />
  </ModalHookProvider>
);