import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Logo from '~/assets/img/logo.jpg';

import { Form, Container } from './styles';

import { useAuth } from '~/hooks/auth';

const SignIn = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [email_err, setEmailErr] = useState('');
  const [password_err, setPasswordErr] = useState('');
  const [error, setError] = useState('');

  const { signIn } = useAuth();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Login';
  }, []);

  async function handleSignIn(e) {
    e.preventDefault();

    if (email.length == 0) {
      setEmailErr('Campo Obrigatório');
    }

    if (password.length == 0) {
      setPasswordErr('Campo Obrigatório');
    }

    if (!email || !password) {
      setError('Preencha todos os campos para entrar ');
    } else {
      signIn({ login: email, password });
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
            placeholder="Seu Email.."
            onChange={(e) => { setEmail(e.target.value); setEmailErr(''); }}
            value={email}
            className={email_err != '' ? 'invalid' : ''}
          />
          <input
            type="password"
            name="password"
            placeholder="Sua Senha Secreta.."
            onChange={(e) => { setPassword(e.target.value); setPasswordErr(''); }}
            value={password}
            className={password_err != '' ? 'invalid' : ''}
          />
          <button type="submit">Entrar</button>
          <hr />
          <Link to="/login">Esqueceu sua senha?</Link>
          <Link to="/login">Não tem uma Conta? Cadastre-se!</Link>
        </Form>
      </Container>
    </>
  );
};

export default SignIn;
