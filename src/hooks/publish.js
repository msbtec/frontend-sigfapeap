import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';
import api from '../services/api';

const PublishContext = createContext({});

export const PublishProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [publishes, setPublihes] = useState([]);

  useEffect(() => {
    async function loadPublishes() {
      api.get(`publishes`).then(({ data }) => {
        setPublihes(data);
      });
    }

    loadPublishes();
  }, []);

  const create = useCallback(async (data, file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("file", file);

    api.post(`publishes`, formData).then(({ data: publish }) => {
      setPublihes([...publishes, publish]);

      store.addNotification({
        message: `Publicação inserida com sucesso!`,
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
  }, [publishes]);

  const update = useCallback(async (data, file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    if (file) {
      formData.append("file", file);
    }

    api.put(`publishes/${data.id}`, data).then(({ data: publish }) => {
      setPublihes(publishes.map((item) => (item.id === data.id ? publish : item)));

      store.addNotification({
        message: `Publicação atualizada com sucesso!`,
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
  }, [publishes]);

  const erase = useCallback(async (data) => {
    setLoading(true);

    api.delete(`publishes/${data.id}`).then(() => {
      setPublihes(publishes.filter((item) => (item.id !== data.id)));

      store.addNotification({
        message: `Publicação deletada com sucesso!`,
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
  }, [publishes]);

  return (
    <PublishContext.Provider
      value={{
        loading,
        publishes,
        create,
        update,
        erase,
      }}
    >
      {children}
    </PublishContext.Provider>
  );
};

export function usePublish() {
  const context = useContext(PublishContext);

  if (!context) {
    throw Error('usePublish must be used within an PublishProvider');
  }

  return context;
}
