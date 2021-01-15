import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { uuid } from 'uuidv4';
import { store } from 'react-notifications-component';
import api from '~/services/api';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      api.get(`usuario`).then(({ data }) => {
        setUsers(data.filter((item) => item.deletedAt == null));
      });
    }

    loadUsers();
  }, []);

  const create = useCallback(async (data) => {
    setLoading(true);
    setUsers([...users, { id: uuid(), ...data }]);
    store.addNotification({
      message: `Usuário cadastrado com sucesso!`,
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
  }, [users]);

  const update = useCallback(async (data) => {
    setLoading(true);
    setUsers(users.map((item) => (item.id === data.id ? data : item)));
    store.addNotification({
      message: `Usuário atualizado com sucesso!`,
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
  }, [users]);

  const erase = useCallback(async (data) => {
    setLoading(true);
    setUsers(users.filter((item) => (item.id !== data.id)));
    store.addNotification({
      message: `Usuário deletado com sucesso!`,
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
  }, [users]);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        create,
        update,
        erase,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw Error('useUser must be used within an UserProvider');
  }

  return context;
}
