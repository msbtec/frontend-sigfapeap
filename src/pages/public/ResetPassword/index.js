import React, { useEffect, useState } from 'react';
import ReactLoading from "react-loading";
import { store } from 'react-notifications-component';
import api from '~/services/api';

import Logo from '../../../assets/img/logo.png';

import { Form, Container } from './styles';

const RecoveryPassword = (props) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const [password, setPassword] = useState({
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    document.title = 'SIGFAPEAP - Recuperação de senha';

    const { search } = props.location;
    const params = new URLSearchParams(search);
    const token = params.get("token");
    setToken(token);

    props.history.replace({
      ...props.location,
      search: "",
    });
  }, []);

  async function handleSignIn(e) {
    e.preventDefault();

    if (password.password != "" && password.password_confirmation != "") {
      if (password.password != password.password_confirmation) {
        setError('As senhas não coincidem!');
      } else {
        setLoading(true);
        api
          .put(`passwords`, { password: password.password, token })
          .then(({ data }) => {
            setLoading(false);

            store.addNotification({
              message: `Senha atualizada com sucesso!`,
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

            setTimeout(() => {
              window.location.href = "/";
            }, 5000);
          })
          .catch((error) => {
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
          })
          .finally(() => {
            setPassword({
              password: "",
              password_confirmation: "",
            });
            setLoading(false);
          });
      }
    } else {
      setError('Preencha corretamente os campos!');
    }
  }

  return (
    <>
      <Container style={{ height: '100vh', padding: '0 10px' }}>
        <Form autoComplete="off" onSubmit={handleSignIn}>
          <img style={{ width: 200, height: 50 }} src={Logo} alt="Airbnb" />
          {error && <p>{error}</p>}
          <input
            type="password"
            name="password"
            value={password.password}
            placeholder="Nova senha"
            onChange={(e) => { setPassword({ ...password, password: e.target.value }); }}
            className={error != '' ? 'invalid' : ''}
          />

          <input
            type="password"
            name="password"
            value={password.password_confirmation}
            placeholder="Confirmar nova senha"
            onChange={(e) => {
              setPassword({
                ...password,
                password_confirmation: e.target.value,
              });
            }}
            className={error != '' ? 'invalid' : ''}
          />

          {loading ? <ReactLoading type="spin" height="15%" width="15%" color="#b20710" /> : <button type="submit">Enviar</button>}
          {/* <button type="submit">Enviar</button> */}
        </Form>
      </Container>
    </>
  );
};

export default RecoveryPassword;
