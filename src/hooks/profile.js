import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { store } from 'react-notifications-component';

const ProfileContext = createContext({});

export const ProfileProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState();

  const insertProfile = useCallback(async (email) => {
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
  }, []);

  const updateProfile = useCallback(async (data) => {
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
  }, []);

  const deleteProfile = useCallback(async (email) => {
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
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        insertProfile,
        updateProfile,
        deleteProfile,
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
