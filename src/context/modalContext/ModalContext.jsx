import React from 'react';
import {
  ModalProvider,
  useModal as rmhUseModal,
} from 'react-modal-hook';

export const ModalHookProvider = ({children}) => (
  <ModalProvider>{children}</ModalProvider>
);

/**
 * @param {JSX.Element} modal
 * @param {any[]} [deps]
 */
export function useModal(modal, deps = null) {
  const [openModal, closeModal] = rmhUseModal(() => {
    const {type: ModalComponent, props, key} = modal;
    return (
      <ModalComponent key={key} {...props} closeModal={closeModal} />
    );
  }, deps);

  return [openModal, closeModal];
}