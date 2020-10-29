import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';

const SearchContext = createContext({});

export const SearchProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [search, setSearches] = useState();

  const insertSearch = useCallback(async (email) => {
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
  }, []);

  const updateSearch = useCallback(async (data) => {
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
  }, []);

  const deleteSearch = useCallback(async (email) => {
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
  }, []);

  return (
    <SearchContext.Provider
      value={{
        insertSearch,
        updateSearch,
        deleteSearch,
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
