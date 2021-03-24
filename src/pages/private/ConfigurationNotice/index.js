import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';

import * as Yup from 'yup';

import ReactLoading from "react-loading";

import { Form as Unform } from '@unform/web';
import { store } from 'react-notifications-component';
import { Button } from '../../../components/Button';

import { Form } from '../../../components/Form';
import Input from '../../../components/Input';
import { Card } from '../../../components/Card';

import getValidationErrors from '../../../utils/getValidationErrors';

import Checkbox from './components/Checkbox';

import api from '../../../services/api';

export default function ConfigurationNotice() {
  const formRef = useRef(null);

  const [fields, setFields] = useState({
    titulo_projeto: { checked: false, value: 0 },
    coordenador: { checked: false, value: 0 },
    email: { checked: false, value: 0 },
    faixa_valor: { checked: false, value: 0 },
    linha_pesquisa: { checked: false, value: 0 },
    instituicao: { checked: false, value: 0 },
    unidade_executora: { checked: false, value: 0 },
    duracao: { checked: false, value: 0 },
    cotacao_moeda_estrangeira: { checked: false, value: 0 },
  });

  const [loadingHeader, setLoadingHeader] = useState(false);
  const [loadingAttachment, setLoadingAttachment] = useState(false);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Configurar Edital';
  }, []);

  const handleSubmitHeader = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        setLoadingHeader(true);

        setTimeout(() => {
          setLoadingHeader(false);
        }, 2000);

        api.put(`route`, {}).then(({ data }) => {
          setLoadingHeader(false);

          store.addNotification({
            message: `Edital configurado com sucesso!`,
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
    [],
  );

  const handleSubmitAttachment = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        setLoadingAttachment(true);

        setTimeout(() => {
          setLoadingAttachment(false);
        }, 2000);

        api.put(`route`, {}).then(({ data }) => {
          setLoadingAttachment(false);

          store.addNotification({
            message: `Edital configurado com sucesso!`,
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
    [],
  );

  return (
    <>
      <div className="col-12 title">
        <h1>Configurar Edital</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Campos do cabeçalho</h3>
          </div>
          <div className="card-body">
            <Unform ref={formRef} onSubmit={handleSubmitHeader}>
              <Form>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, titulo_projeto: { ...fields.titulo_projeto, checked: !fields.titulo_projeto.checked } })}
                      checked={fields.titulo_projeto.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Título do projeto"
                    />

                    <Input type="number" disabled={!fields.titulo_projeto.checked} formRef={formRef} name="title" original />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, coordenador: { ...fields.coordenador, checked: !fields.coordenador.checked } })}
                      checked={fields.coordenador.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Coordenador"
                    />

                    <Input type="number" disabled={!fields.coordenador.checked} formRef={formRef} name="coordenator" original />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, email: { ...fields.email, checked: !fields.email.checked } })}
                      checked={fields.email.checked}
                      fields={fields}
                      setFields={setFields}
                      title="E-mail"
                    />

                    <Input type="number" disabled={!fields.email.checked} formRef={formRef} name="email" original />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, faixa_valor: { ...fields.faixa_valor, checked: !fields.faixa_valor.checked } })}
                      checked={fields.faixa_valor.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Faixa de valor"
                    />

                    <Input type="number" disabled={!fields.faixa_valor.checked} formRef={formRef} name="faixa_value" original />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, linha_pesquisa: { ...fields.linha_pesquisa, checked: !fields.linha_pesquisa.checked } })}
                      checked={fields.linha_pesquisa.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Linha de pesquisa"
                    />

                    <Input type="number" disabled={!fields.linha_pesquisa.checked} formRef={formRef} name="line_reseacher" original />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, instituicao: { ...fields.instituicao, checked: !fields.instituicao.checked } })}
                      checked={fields.instituicao.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Instituição"
                    />

                    <Input type="number" disabled={!fields.instituicao.checked} formRef={formRef} name="line_reseacher" original />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, unidade_executora: { ...fields.unidade_executora, checked: !fields.unidade_executora.checked } })}
                      checked={fields.unidade_executora.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Unidade Executora"
                    />

                    <Input type="number" disabled={!fields.unidade_executora.checked} formRef={formRef} name="unit_execution" original />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, duracao: { ...fields.duracao, checked: !fields.duracao.checked } })}
                      checked={fields.duracao.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Duração"
                    />

                    <Input type="number" disabled={!fields.duracao.checked} formRef={formRef} name="duration" original />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, cotacao_moeda_estrangeira: { ...fields.cotacao_moeda_estrangeira, checked: !fields.cotacao_moeda_estrangeira.checked } })}
                      checked={fields.cotacao_moeda_estrangeira.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Contação da Moeda Estrangeira"
                    />

                    <Input type="number" disabled={!fields.cotacao_moeda_estrangeira.checked} formRef={formRef} name="duration" original />
                  </div>
                </div>

                <div className="modal-footer">
                  {loadingHeader ? (<ReactLoading type="spin" height="5%" width="5%" color="#3699ff" />) : (
                    <Button
                      className="primary"
                    >
                      Salvar
                    </Button>
                  )}
                </div>
              </Form>
            </Unform>
          </div>
        </Card>

        <Card className="red">
          <div className="card-title">
            <h3>Campos de anexo</h3>
          </div>
          <div className="card-body">
            <Unform ref={formRef} onSubmit={handleSubmitAttachment}>
              <Form>
                <Input formRef={formRef} name="name" original title="Nome" />

                <Input formRef={formRef} name="size" original title="Tamanho máximo" />

                <Input formRef={formRef} name="quantity" original title="Número máximo" />

                <div className="modal-footer">
                  {loadingAttachment ? (<ReactLoading type="spin" height="5%" width="5%" color="#3699ff" />) : (
                    <Button
                      className="primary"
                    >
                      Salvar
                    </Button>
                  )}
                </div>
              </Form>
            </Unform>
          </div>
        </Card>
      </div>
    </>
  );
}
