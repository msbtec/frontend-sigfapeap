import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { uuid } from 'uuidv4';
import { store } from 'react-notifications-component';

const ProfileContext = createContext({});

export const ProfileProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState([
    {
      label: 'Dashboard',
      value: 'Dashboard',
    },
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
  ]);

  const [profiles, setProfiles] = useState([
    {
      id: uuid(),
      name: 'Administrador',
      access,
    },
    {
      id: uuid(),
      name: 'Servidor',
      access: [
        {
          label: 'Pesquisadores',
          value: 'Pesquisadores',
        },
      ],
    },
  ]);

  const create = useCallback(async (data) => {
    setLoading(true);
    setProfiles([...profiles, { id: uuid(), ...data }]);
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
    setLoading(false);
  }, [profiles]);

  const update = useCallback(async (data) => {
    setLoading(true);
    setProfiles(profiles.map((item) => (item.id === data.id ? data : item)));
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
    setLoading(false);
  }, [profiles]);

  const erase = useCallback(async (data) => {
    setLoading(true);
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
    setLoading(false);
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
