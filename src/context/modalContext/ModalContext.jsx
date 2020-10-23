import React from 'react';
import {
  ModalProvider,
  useModal as rmhUseModal,
} from 'react-modal-hook';

const BODY_HAS_CLASS_MODAL = 'has-modal';

export const ModalHookProvider = ({children}) => (
  <ModalProvider>{children}</ModalProvider>
);

/**
 * @param {JSX.Element} modal
 * @param {any[]} [deps]
 */
export function useModal(modal, deps = null) {
  const onOpenModal = openModal => () => {
    document.body.classList.add(BODY_HAS_CLASS_MODAL);
    openModal();
  }

  const onCloseModal = closeModal => () => {
    document.body.classList.remove(BODY_HAS_CLASS_MODAL);
    closeModal();
  }

  const [openModal, closeModal] = rmhUseModal(() => {
    const {type: ModalComponent, props, key} = modal;
    return (
      <ModalComponent key={key} {...props} closeModal={onCloseModal(closeModal)} />
    );
  }, deps);

  return [onOpenModal(openModal), onCloseModal(closeModal)];
}
