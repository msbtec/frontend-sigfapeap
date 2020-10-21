import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useMemo,
} from 'react';

import { store } from 'react-notifications-component';
import { useHistory } from 'react-router-dom';

import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('@sigfapeap:token');
    const user = localStorage.getItem('@sigfapeap:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      const parseUser = JSON.parse(user);

      return {
        token,
        user: parseUser,
      };
    }

    return {};
  });

  const signed = useMemo(
    () => !!auth.token && !!auth.user,
    [auth],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@sigfapeap:token');
    localStorage.removeItem('@sigfapeap:user');
  }, []);

  const refreshUser = useCallback(async () => {
    const response = await api.get('/profile');

    const user = response.data;

    localStorage.setItem('@sigfapeap:user', JSON.stringify(user));

    setAuth((oldData) => ({ ...oldData, user }));
  }, []);

  const signIn = useCallback(async ({ login, password }) => {
    setLoading(true);

    try {
      // const response = await api.post("sessions", {
      //     login,
      //     password
      // });

      // const { user, token } = response.data;

      const token = 'lkgjrgrtggrt';
      const user = { id: 'lkgjrgrtggrt' };

      api.defaults.headers.authorization = `Bearer ${token}`;

      setAuth({ token, user });

      localStorage.setItem('@sigfapeap:user', JSON.stringify(user));
      localStorage.setItem('@sigfapeap:token', token);

      window.location.href = '/';
    } catch (err) {
      localStorage.removeItem('@sigfapeap:token');
      localStorage.removeItem('@sigfapeap:user');

      const message = 'Ocorreu um erro ao fazer login, verifique suas credenciais!';

      store.addNotification({
        message,
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
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        loading,
        signIn,
        signOut,
        refreshUser,
        token: auth.token,
        signed,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
