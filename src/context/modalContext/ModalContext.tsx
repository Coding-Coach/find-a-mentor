import React, { FC } from 'react';
import { ModalProvider, useModal as rmhUseModal } from 'react-modal-hook';

const BODY_HAS_CLASS_MODAL = 'has-modal';

export const ModalHookProvider: FC = ({ children }) => (
  <ModalProvider>{children}</ModalProvider>
);

export function useModal(modal: JSX.Element, deps?: any[]): [openModal: () => void, closeModal: () => void] {
  const onOpenModal = (openModal: () => void) => () => {
    document.body.classList.add(BODY_HAS_CLASS_MODAL);
    openModal();
  };

  const onCloseModal = (closeModal: () => void) => () => {
    document.body.classList.remove(BODY_HAS_CLASS_MODAL);
    closeModal();
  };

  const [openModal, closeModal] = rmhUseModal(() => {
    const { type: ModalComponent, props, key } = modal;
    return (
      <ModalComponent
        key={key}
        {...props}
        closeModal={onCloseModal(closeModal)}
      />
    );
  }, deps);

  return [onOpenModal(openModal), onCloseModal(closeModal)];
}
