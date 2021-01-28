import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';
import api from '../services/api';

const OfficeContext = createContext({});

export const OfficeProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    async function loadOffices() {
      api.get(`offices`).then(({ data }) => {
        setOffices(data);
      });
    }

    loadOffices();
  }, []);

  const create = useCallback(async (data) => {
    setLoading(true);

    api.post(`offices`, data).then(({ data: office }) => {
      setOffices([...offices, office]);
    }).finally(() => {
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
    });
  }, [offices]);

  const update = useCallback(async (data) => {
    setLoading(true);

    api.put(`offices/${data.id}`, data).then(({ data: office }) => {
      setOffices(offices.map((item) => (item.id === data.id ? office : item)));
    }).finally(() => {
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
    });
  }, [offices]);

  const erase = useCallback(async (data) => {
    setLoading(true);

    api.delete(`offices/${data.id}`).then(() => {
      setOffices(offices.filter((item) => (item.id !== data.id)));
    }).finally(() => {
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
    });
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
