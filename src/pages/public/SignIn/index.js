import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Footer from '../../../components/Footer';

import Logo from '../../../assets/img/logo.png';

import { Form, Container } from './styles';

import { useAuth } from '../../../hooks/auth';

import { cpfMask } from '../../../utils/validations';

const SignIn = () => {
  const [cpf, setCPF] = useState('');
  const [password, setPassword] = useState('');
  const [cpf_err, setCPFerr] = useState('');
  const [password_err, setPasswordErr] = useState('');
  const [error, setError] = useState('');

  const { signIn } = useAuth();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Login';
  }, []);

  async function handleSignIn(e) {
    e.preventDefault();

    if (cpf.length == 0) {
      setCPFerr('Campo Obrigatório');
    }

    if (password.length == 0) {
      setPasswordErr('Campo Obrigatório');
    }

    if (!cpf || !password) {
      setError('Preencha todos os campos para entrar ');
    } else {
      signIn({ cpf, password });
    }
  }

  return (
    <>
      <Container style={{ height: "100vh", justifyContent: 'space-between' }}>
        <div />

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Form autoComplete="off" onSubmit={handleSignIn}>
            <img style={{ width: 200, height: 50 }} src={Logo} alt="Airbnb" />
            {error && <p>{error}</p>}
            <input
              type="text"
              name="cpf"
              placeholder="CPF"
              onChange={(e) => {
                const formatted = cpfMask(e.target.value);
                setCPF(formatted);
                setCPFerr('');
              }}
              value={cpf}
              className={cpf_err != '' ? 'invalid' : ''}
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              onChange={(e) => { setPassword(e.target.value); setPasswordErr(''); }}
              value={password}
              className={password_err != '' ? 'invalid' : ''}
            />
            <button type="submit">Entrar</button>
            <hr />
            <Link to="/recuperacao-senha">Esqueceu sua senha?</Link>
            <Link to="/cadastro">Não tem uma Conta? Cadastre-se!</Link>
          </Form>
        </div>

        <Footer />
      </Container>
    </>
  );
};

export default SignIn;
