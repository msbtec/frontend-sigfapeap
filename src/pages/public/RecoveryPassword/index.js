import React, { useEffect, useState } from 'react';

import { store } from 'react-notifications-component';
import Logo from '../../../assets/img/logo.png';

import { Form, Container } from './styles';

const RecoveryPassword = () => {
  const [email, setEmail] = useState('');
  const [email_err, setEmailErr] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'SIGFAPEAP - Recuperação de senha';
  }, []);

  async function handleSignIn(e) {
    e.preventDefault();

    if (email.length == 0) {
      setEmailErr('Campo Obrigatório');
    }

    if (!email) {
      setError('Preencha todos os campos para entrar ');
    } else {
      store.addNotification({
        message: `Foi enviada uma solicitação de recuperação de senha para: ${email}!`,
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
    }
  }

  return (
    <>
      <Container style={{ height: '100vh', padding: '0 10px' }}>
        <Form autoComplete="off" onSubmit={handleSignIn}>
          <img style={{ width: 200, height: 50 }} src={Logo} alt="Airbnb" />
          {error && <p>{error}</p>}
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail.."
            onChange={(e) => { setEmail(e.target.value); setEmailErr(''); }}
            value={email}
            className={email_err != '' ? 'invalid' : ''}
          />
          <button type="submit">Enviar</button>
        </Form>
      </Container>
    </>
  );
};

export default RecoveryPassword;
