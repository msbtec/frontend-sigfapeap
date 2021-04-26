import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';
import api from '../services/api';

const DocumentContext = createContext({});

export const DocumentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    async function loadDocuments() {
      api.get(`documents`).then(({ data }) => {
        setDocuments(data);
      });
    }

    loadDocuments();
  }, []);

  const create = useCallback(async (data, file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("file", file);

    api.post(`documents`, formData).then(({ data: document }) => {
      setDocuments([...documents, document]);

      store.addNotification({
        message: `Documento inserido com sucesso!`,
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
  }, [documents]);

  const update = useCallback(async (data, file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);

    if (file) {
      formData.append("file", file);
    }

    api.put(`documents/${data.id}`, data).then(({ data: document }) => {
      setDocuments(documents.map((item) => (item.id === data.id ? document : item)));

      store.addNotification({
        message: `Documento atualizado com sucesso!`,
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
  }, [documents]);

  const erase = useCallback(async (data) => {
    setLoading(true);

    api.delete(`documents/${data.id}`).then(() => {
      setDocuments(documents.filter((item) => (item.id !== data.id)));

      store.addNotification({
        message: `Documento deletado com sucesso!`,
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
  }, [documents]);

  return (
    <DocumentContext.Provider
      value={{
        loading,
        documents,
        create,
        update,
        erase,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export function useDocument() {
  const context = useContext(DocumentContext);

  if (!context) {
    throw Error('useDocument must be used within an DocumentProvider');
  }

  return context;
}
