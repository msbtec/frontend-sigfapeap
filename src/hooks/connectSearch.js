import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { uuid } from 'uuidv4';
import { store } from 'react-notifications-component';

const ConnectSearchContext = createContext({});

export const ConnectSearchProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [connectSearches, setConnectSearches] = useState([
    {
      id: uuid(),
      name: "Ciências Sociais",
    },
    {
      id: uuid(),
      name: "Ciências Exatas",
    },
  ]);

  const create = useCallback(async (data) => {
    setLoading(true);
    setConnectSearches([...connectSearches, { id: uuid(), ...data }]);
    store.addNotification({
      message: `Linha vínculada inserida com sucesso!`,
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
  }, [connectSearches]);

  const update = useCallback(async (data) => {
    setLoading(true);
    setConnectSearches(connectSearches.map((item) => (item.id === data.id ? data : item)));
    store.addNotification({
      message: `Linha vínculada atualizada com sucesso!`,
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
  }, [connectSearches]);

  const erase = useCallback(async (data) => {
    setLoading(true);
    setConnectSearches(connectSearches.filter((item) => (item.id !== data.id)));
    store.addNotification({
      message: `Linha vínculada deletada com sucesso!`,
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
  }, [connectSearches]);

  return (
    <ConnectSearchContext.Provider
      value={{
        connectSearches,
        loading,
        create,
        update,
        erase,
      }}
    >
      {children}
    </ConnectSearchContext.Provider>
  );
};

export function useConnectSearch() {
  const context = useContext(ConnectSearchContext);

  if (!context) {
    throw Error('useSearch must be used within an ConnectSearchProvider');
  }

  return context;
}
