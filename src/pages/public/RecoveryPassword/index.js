import React, { useEffect, useState } from 'react';

import Logo from '../../../assets/img/logo.jpg';

import { Form, Container } from './styles';

import { useAuth } from '../../../hooks/auth';

const RecoveryPassword = () => {
  const [email, setEmail] = useState('');
  const [email_err, setEmailErr] = useState('');
  const [error, setError] = useState('');

  const { recovery } = useAuth();

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
      recovery(email);
    }
  }

  return (
    <>
      <Container style={{ height: '100vh', padding: '0 10px' }}>
        <Form autoComplete="off" onSubmit={handleSignIn}>
          <img src={Logo} alt="Airbnb" />
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
