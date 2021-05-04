import React, { useEffect, useState } from 'react';
import ReactLoading from "react-loading";
import { store } from 'react-notifications-component';
import api from '../../../services/api';

import Logo from '../../../assets/img/logo.png';

import { Form, Container } from './styles';

const ActiveAccount = (props) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Ativação de conta';

    const { search } = props.location;
    const params = new URLSearchParams(search);
    const token = params.get("token");

    api.post('active/account', { token }).then(({ data }) => {
      store.addNotification({
        message: `Conta ativada com sucesso!`,
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

      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
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
    });
  }, [props]);

  return (
    <>
      <Container style={{ height: '100vh', padding: '0 10px' }}>
        <Form>
          <img style={{ width: 200, height: 50 }} src={Logo} alt="Airbnb" />
          {loading ? <ReactLoading type="spin" height="15%" width="15%" color="#080" /> : <p style={{ borderColor: '#080', color: '#080' }}>Sua conta foi ativada com sucesso! Aguarde, você será redirecionado(a) para a tela de login.</p>}
        </Form>
      </Container>
    </>
  );
};

export default ActiveAccount;
