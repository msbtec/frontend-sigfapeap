import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';
import api from '../services/api';

const ProfileContext = createContext({});

export const ProfileProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const access = [
    {
      label: 'Servidores',
      value: 'Servidores',
    },
    {
      label: 'Cargos',
      value: 'Cargos',
    },
    {
      label: 'Perfis de acesso',
      value: 'Perfis de acesso',
    },
    {
      label: 'Área de pesquisa',
      value: 'Área de pesquisa',
    },
    {
      label: 'Instituição de pesquisa',
      value: 'Instituição de pesquisa',
    },
    {
      label: 'Programas',
      value: 'Programas',
    },
    {
      label: 'Avaliadores',
      value: 'Avaliadores',
    },
    {
      label: 'Pesquisadores',
      value: 'Pesquisadores',
    },
  ];

  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    async function loadProfiles() {
      api.get(`profiles`).then(({ data }) => {
        setProfiles(data.map((item) => ({
          ...item,
          access: JSON.parse(item.access),
        })));
      });
    }

    loadProfiles();
  }, []);

  const create = useCallback(async (data) => {
    setLoading(true);

    api.post(`profiles`, { ...data, access: JSON.stringify(data.access) }).then(({ data: profile }) => {
      setProfiles([...profiles, { ...profile, access: JSON.parse(profile.access) }]);

      store.addNotification({
        message: `Perfil inserido com sucesso!`,
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
  }, [profiles]);

  const update = useCallback(async (data) => {
    setLoading(true);

    api.put(`profiles/${data.id}`, { ...data, access: JSON.stringify(data.access) }).then(({ data: profile }) => {
      setProfiles(profiles.map((item) => (item.id === data.id
        ? { ...profile, access: JSON.parse(profile.access) } : item)));

      store.addNotification({
        message: `Perfil atualizado com sucesso!`,
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
  }, [profiles]);

  const erase = useCallback(async (data) => {
    setLoading(true);

    api.delete(`profiles/${data.id}`).then(() => {
      setProfiles(profiles.filter((item) => (item.id !== data.id)));

      store.addNotification({
        message: `Perfil deletado com sucesso!`,
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
    }).catch((error) => {
      store.addNotification({
        message: error.response.data.message,
        type: 'danger',
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
  }, [profiles]);

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        access,
        loading,
        create,
        update,
        erase,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw Error('useProfile must be used within an ProfileProvider');
  }

  return context;
}
