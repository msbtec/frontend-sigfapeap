import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';
import api from '../services/api';

const ArchiveContext = createContext({});

export const ArchiveProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [archives, setArchives] = useState([]);

  useEffect(() => {
    async function loadArchives() {
      api.get(`archives`).then(({ data }) => {
        setArchives(data);
      });
    }

    loadArchives();
  }, []);

  const create = useCallback(async (data, file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("file", file);

    api.post(`archives`, formData).then(({ data: archive }) => {
      setArchives([...archives, archive]);

      store.addNotification({
        message: `Arquivo inserido com sucesso!`,
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
  }, [archives]);

  const update = useCallback(async (data, file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);

    if (file) {
      formData.append("file", file);
    }

    api.put(`archives/${data.id}`, data).then(({ data: archive }) => {
      setArchives(archives.map((item) => (item.id === data.id ? archive : item)));

      store.addNotification({
        message: `Arquivo atualizado com sucesso!`,
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
  }, [archives]);

  const erase = useCallback(async (data) => {
    setLoading(true);

    api.delete(`archives/${data.id}`).then(() => {
      setArchives(archives.filter((item) => (item.id !== data.id)));

      store.addNotification({
        message: `Arquivo deletado com sucesso!`,
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
  }, [archives]);

  return (
    <ArchiveContext.Provider
      value={{
        loading,
        archives,
        create,
        update,
        erase,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};

export function useArchive() {
  const context = useContext(ArchiveContext);

  if (!context) {
    throw Error('useArchive must be used within an ArchiveProvider');
  }

  return context;
}
