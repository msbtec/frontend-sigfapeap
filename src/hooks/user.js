import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';
import api from '../services/api';

import { useAuth } from './auth';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const [totalPages, setTotalPages] = useState(0);

  const { user } = useAuth();

  async function loadUsers(page = 0) {
    api.get(`users`, {
      params: {
        page: page + 1,
        researcher: null,
      },
    }).then(({ data }) => {
      setTotalPages(data.lastPage);
      setUsers(data.data);
      // setUsers(data.data.filter((item) => item.id !== user?.id));
    });
  }

  useEffect(() => {
    loadUsers(0);
  }, []);

  const create = useCallback(async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("data", JSON.stringify({ ...data, name: String(data.name).toUpperCase(), password: 'sigfapeap@2021' }));

    api.post(`auth/register`, formData).then(({ data: user }) => {
      setUsers([...users, user]);
    }).finally(() => {
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
    });
  }, [users]);

  const update = useCallback(async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", String(data.name).toUpperCase());
    formData.append("cpf", data.cpf);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("phone", data.phone);
    formData.append("office_id", data.office_id);
    formData.append("profile_id", data.profile_id);

    api.put(`users/${data.id}`, formData).then(({ data: user }) => {
      setUsers(users.map((item) => (item.id === data.id ? user : item)));
    }).finally(() => {
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
    });
  }, [users]);

  const erase = useCallback(async (data) => {
    setLoading(true);

    api.delete(`users/${data.id}`).then(() => {
      setUsers(users.filter((item) => (item.id !== data.id)));
    }).finally(() => {
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
    });
  }, [users]);

  return (
    <UserContext.Provider
      value={{
        totalPages,
        loadUsers,
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
