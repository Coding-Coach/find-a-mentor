import { createContext, FC } from 'react';
import { ModalProvider, useModal as rmhUseModal } from 'react-modal-hook';

export const ModalContext = createContext<{
  closeModal(): void;
}>({closeModal: () => {}});

export const ModalHookProvider: FC = ({ children }) => (
  <ModalProvider>{children}</ModalProvider>
);

export function useModal(modal: JSX.Element, deps?: any[]): [openModal: () => void, closeModal: () => void] {
  const [openModal, closeModal] = rmhUseModal(() => {
    const { type: ModalComponent, props, key } = modal;
    return (
      <ModalContext.Provider value={{closeModal}}>
        <ModalComponent
          key={key}
          {...props}
        />
      </ModalContext.Provider>
    );
  }, deps);

  return [openModal, closeModal];
}
