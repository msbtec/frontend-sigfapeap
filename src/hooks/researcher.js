import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';
import api from '../services/api';

import { useAuth } from "./auth";

const ResearcherContext = createContext({});

export const ResearcherProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersAll, setUsersAll] = useState([]);

  const { signIn } = useAuth();

  useEffect(() => {
    async function loadResearches() {
      api.get(`users`).then(({ data }) => {
        setUsers(data.filter((item) => item.profile.name === "Pesquisador"));
        setUsersAll(data.filter((item) => item.profile.name === "Pesquisador"));
      });
    }

    loadResearches();
  }, []);

  const create = useCallback(async (data, avatar) => {
    setLoading(true);

    delete data.confirmation_password;

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("avatar", avatar.avatar);

    api.post(`/auth/register`, formData).then(({ data: user }) => {
      setUsers([...users, user]);

      signIn({ cpf: user.cpf, password: data.password });
    });

    store.addNotification({
      message: `Pesquisador cadastrado com sucesso!`,
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
  }, [users, signIn]);

  const update = useCallback(async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("evaluator", data.evaluator);

    api.put(`users/${data.id}`, formData).then(({ data: user }) => {
      setUsers(users.map((item) => (item.id === data.id
        ? {
          ...user, evaluator: data.evaluator, profile: item.profile, office: item.office,
        } : item)));
    }).finally(() => {
      store.addNotification({
        message: `Pesquisador atualizado com sucesso!`,
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
        message: `Pesquisador deletado com sucesso!`,
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
    <ResearcherContext.Provider
      value={{
        users,
        usersAll,
        setUsers,
        loading,
        create,
        update,
        erase,
      }}
    >
      {children}
    </ResearcherContext.Provider>
  );
};

export function useResearcher() {
  const context = useContext(ResearcherContext);

  if (!context) {
    throw Error('useResearcher must be used within an ResearcherProvider');
  }

  return context;
}
