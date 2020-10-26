import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';

const OfficeContext = createContext({});

export const OfficeProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState();

  const insertOffice = useCallback(async (email) => {
    store.addNotification({
      message: `Cargo inserido com sucesso!`,
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

  const updateOffice = useCallback(async (data) => {
    store.addNotification({
      message: `Cargo atualizado com sucesso!`,
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

  const deleteOffice = useCallback(async (email) => {
    store.addNotification({
      message: `Cargo deletado com sucesso!`,
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
    <OfficeContext.Provider
      value={{
        insertOffice,
        updateOffice,
        deleteOffice,
      }}
    >
      {children}
    </OfficeContext.Provider>
  );
};

export function useOffice() {
  const context = useContext(OfficeContext);

  if (!context) {
    throw Error('useOffice must be used within an OfficeProvider');
  }

  return context;
}
