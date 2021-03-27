import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';

import * as Yup from 'yup';

import ReactLoading from "react-loading";

import { Form as Unform } from '@unform/web';
import { store } from 'react-notifications-component';
import { Button } from '../../../components/Button';

import { Content } from './styles';

import { Card } from '../../../components/Card';

import Header from './Header';
import Attachment from './Attachment';

import getValidationErrors from '../../../utils/getValidationErrors';

import api from '../../../services/api';

export default function Project() {
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [screen, setScreen] = useState({
    header: true,
    attachment: false,
  });

  const [knowledgesArea, setKnowledgesArea] = useState({
    one: '',
    two: '',
  });

  useEffect(() => {
    document.title = 'SIGFAPEAP - Submeter Projeto';
  }, []);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        if (screen.header) {
          const schema = Yup.object().shape({
            title: Yup.string().required('Campo obrigatório'),
            coordenator: Yup.string().required('Campo obrigatório'),
            email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
            faixa_value: Yup.string().required('Campo obrigatório'),
            institution: Yup.string().required('Campo obrigatório'),
            unity_execution: Yup.string().required('Campo obrigatório'),
            duration: Yup.string().required('Campo obrigatório'),
            money_foreign: Yup.string().required('Campo obrigatório'),
          });

          await schema.validate(data, {
            abortEarly: false,
          });
        }

        setLoading(true);

        setTimeout(() => {
          setLoading(false);
        }, 2000);

        api.put(`route`, {}).then(({ data }) => {
          setLoading(false);

          store.addNotification({
            message: `Projeto submetido com sucesso!`,
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
        }).finally(() => {});
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [screen],
  );

  return (
    <>
      <div className="col-12 title">
        <h1>Submeter projeto</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-body">
            <Unform ref={formRef} onSubmit={handleSubmit}>

              <ul className="breadcrumb" style={{ marginBottom: 20 }}>
                <li style={{
                  backgroundColor: screen.header ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
                }}
                >
                  <a onClick={() => setScreen({ ...screen, header: true, attachment: false })}>Cabeçalho</a>
                </li>
                <li style={{
                  backgroundColor: screen.attachment ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
                }}
                >
                  <a onClick={() => setScreen({ ...screen, header: false, attachment: true })}>Anexo</a>
                </li>
                <li style={{
                  backgroundColor: '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
                }}
                >
                  <a>Plano de apresentação</a>
                </li>
                <li style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 10 }}><a>Diarias</a></li>
              </ul>

              <Content>
                {screen.header && <Header formRef={formRef} knowledgesArea={knowledgesArea} setKnowledgesArea={setKnowledgesArea} />}
                {screen.attachment && <Attachment formRef={formRef} />}
              </Content>

              <div className="modal-footer">
                {loading ? (<ReactLoading type="spin" height="5%" width="5%" color="#3699ff" />) : (
                  <Button
                    className="primary"
                  >
                    Salvar
                  </Button>
                )}
              </div>
            </Unform>
          </div>
        </Card>
      </div>
    </>
  );
}
