import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';
import api from '../services/api';

const FoundationContext = createContext({});

export const FoundationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [foundations, setFoundations] = useState([]);

  useEffect(() => {
    async function loadFoundations() {
      api.get(`foundations`).then(({ data }) => {
        setFoundations(data);
      });
    }

    loadFoundations();
  }, []);

  const create = useCallback(async (data) => {
    setLoading(true);

    api.post(`foundations`, data).then(({ data: foundation }) => {
      setFoundations([...foundations, foundation]);

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
    }).finally(() => {
      setLoading(false);
    });
  }, [foundations]);

  const update = useCallback(async (data) => {
    setLoading(true);

    api.put(`foundations/${data.id}`, data).then(({ data: foundation }) => {
      setFoundations(foundations.map((item) => (item.id === data.id ? foundation : item)));

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
    }).finally(() => {
      setLoading(false);
    });
  }, [foundations]);

  const erase = useCallback(async (data) => {
    setLoading(true);

    api.delete(`foundations/${data.id}`).then(() => {
      setFoundations(foundations.filter((item) => (item.id !== data.id)));

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
    }).finally(() => {
      setLoading(false);
    });
  }, [foundations]);

  return (
    <FoundationContext.Provider
      value={{
        foundations,
        loading,
        create,
        update,
        erase,
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
