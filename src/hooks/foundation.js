import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';

const FoundationContext = createContext({});

export const FoundationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [foundation, setFoundations] = useState();

  const insertFoundation = useCallback(async (email) => {
    store.addNotification({
      message: `Instituição de pesquisa inserida com sucesso!`,
      type: 'success',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
  }, []);

  const updateFoundation = useCallback(async (data) => {
    store.addNotification({
      message: `Instituição de pesquisa atualizada com sucesso!`,
      type: 'success',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
  }, []);

  const deleteFoundation = useCallback(async (email) => {
    store.addNotification({
      message: `Instituição de pesquisa deletada com sucesso!`,
      type: 'success',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
  }, []);

  return (
    <FoundationContext.Provider
      value={{
        insertFoundation,
        updateFoundation,
        deleteFoundation,
      }}
    >
      {children}
    </FoundationContext.Provider>
  );
};

export function useFoundation() {
  const context = useContext(FoundationContext);

  if (!context) {
    throw Error('useFoundation must be used within an FoundationProvider');
  }

  return context;
}
