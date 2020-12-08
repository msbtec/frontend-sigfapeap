import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { uuid } from 'uuidv4';
import { store } from 'react-notifications-component';

const OfficeContext = createContext({});

export const OfficeProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([
    {
      id: uuid(),
      name: "Programador",
    },
  ]);

  const create = useCallback(async (data) => {
    setLoading(true);
    setOffices([...offices, { id: uuid(), ...data }]);
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
    setLoading(false);
  }, [offices]);

  const update = useCallback(async (data) => {
    setLoading(true);
    setOffices(offices.map((item) => (item.id === data.id ? data : item)));
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
    setLoading(false);
  }, [offices]);

  const erase = useCallback(async (data) => {
    setLoading(true);
    setOffices(offices.filter((item) => (item.id !== data.id)));
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
    setLoading(false);
  }, [offices]);

  return (
    <OfficeContext.Provider
      value={{
        loading,
        offices,
        create,
        update,
        erase,
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
