import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';
import api from '../services/api';

const SearchContext = createContext({});

export const SearchProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    async function loadSearches() {
      api.get(`searchareas`).then(({ data }) => {
        setSearches(data.map((item) => ({
          ...item,
          connection_area: item.connections.map((connection) => (
            { value: connection.id, label: connection.name }
          )),
        })));
      });
    }

    loadSearches();
  }, []);

  const create = useCallback(async (data) => {
    setLoading(true);

    api.post(`searchareas`, data).then(({ data: searcharea }) => {
      setSearches([...searches, {
        ...searcharea,
        connection_area: searcharea.connections.map((connection) => (
          { value: connection.id, label: connection.name }
        )),
      }]);

      store.addNotification({
        message: `Área de pesquisa inserida com sucesso!`,
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
  }, [searches]);

  const update = useCallback(async (data) => {
    setLoading(true);

    api.put(`searchareas/${data.id}`, data).then(({ data: searcharea }) => {
      setSearches(searches.map((item) => (item.id === data.id ? {
        ...searcharea,
        connection_area: searcharea.connections.map((connection) => (
          { value: connection.id, label: connection.name }
        )),
      } : item)));

      store.addNotification({
        message: `Área de pesquisa atualizada com sucesso!`,
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
  }, [searches]);

  const erase = useCallback(async (data) => {
    setLoading(true);

    api.delete(`searchareas/${data.id}`).then(() => {
      setSearches(searches.filter((item) => (item.id !== data.id)));

      store.addNotification({
        message: `Área de pesquisa deletada com sucesso!`,
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
  }, [searches]);

  return (
    <SearchContext.Provider
      value={{
        searches,
        loading,
        create,
        update,
        erase,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw Error('useSearch must be used within an SearchProvider');
  }

  return context;
}
