import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { uuid } from 'uuidv4';
import { store } from 'react-notifications-component';

const SearchContext = createContext({});

export const SearchProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [searches, setSearches] = useState([
    {
      id: uuid(),
      name: "Ciências Sociais",
      connection: "",
    },
    {
      id: uuid(),
      name: "Ciências Exatas",
      connection: "",
    },
    {
      id: uuid(),
      name: "Filosofia",
      connection: "Ciências Sociais",
    },
    {
      id: uuid(),
      name: "Matemática",
      connection: "Ciências Exatas",
    },
  ]);

  const create = useCallback(async (data) => {
    setLoading(true);
    setSearches([...searches, { id: uuid(), ...data }]);
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
  }, [searches]);

  const update = useCallback(async (data) => {
    setLoading(true);
    setSearches(searches.map((item) => (item.id === data.id ? data : item)));
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
    setLoading(false);
  }, [searches]);

  const erase = useCallback(async (data) => {
    setLoading(true);
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
    setLoading(false);
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
