import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useMemo,
} from 'react';

import { store } from 'react-notifications-component';

import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
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
    setLoading(true);
    const response = await api.get('/profile');

    const user = response.data;

    localStorage.setItem('@sigfapeap:user', JSON.stringify(user));

    setAuth((oldData) => ({ ...oldData, user }));
    setLoading(false);
  }, []);

  const signIn = useCallback(async ({ cpf, password }) => {
    setLoading(true);

    try {
      const token = "frhtu59t8y54h594ht8547ht58";
      let user = {};

      if (cpf === '138.786.940-08') {
        user = {
          id: "frhtu59t8y54h594ht8547ht58",
          cpf: '138.786.940-08',
          email: 'adolfo@mail.com',
          nome: 'Adolfo Administrador',
          nomeReduzido: 'Adolfo Administrador',
          office: 'Programador',
          perfil: 'Administrador',
        };
      } else if (cpf === '115.720.330-29') {
        user = {
          id: "frhtu59t8y54h594ht8547ht58",
          cpf: '115.720.330-29',
          email: 'adolfo@mail.com',
          nome: 'Adolfo Servidor',
          nomeReduzido: 'Adolfo Servidor',
          office: 'Programador',
          perfil: 'Servidor',
        };
      } else if (cpf === '067.303.840-85') {
        user = {
          id: "frhtu59t8y54h594ht8547ht58",
          cpf: '067.303.840-85',
          email: 'adolfo@mail.com',
          nome: 'Adolfo Pesquisador',
          nomeReduzido: 'Adolfo Pesquisador',
          office: 'Programador',
          perfil: 'Pesquisador',
        };
      } else {
        throw 'Ocorreu um erro ao fazer login, verifique suas credenciais!';
      }

      api.defaults.headers.authorization = `Bearer ${token}`;

      setAuth({ token, user });

      localStorage.setItem('@sigfapeap:user', JSON.stringify(user));
      localStorage.setItem('@sigfapeap:token', token);

      window.location.href = '/';

      //   const { data } = await api.post(`/sessao/usuario`, {
      //     cpf,
      //     senha: password,
      //   });

      //   api.defaults.headers.authorization = `Bearer ${data.tokenUsuario}`;

      //   setAuth({ token: data.tokenUsuario, user: data.usuario });

      //   localStorage.setItem('@sigfapeap:user', JSON.stringify(data.usuario));
      //   localStorage.setItem('@sigfapeap:token', data.tokenUsuario);

      //   setLoading(false);

    //   window.location.href = '/';
    } catch (err) {
      setLoading(false);

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
