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

  const [anexo, setAnexo] = useState(null);
  const [fields, setFields] = useState({
    titulo_projeto: { checked: true, value: 0 },
    coordenador: { checked: true, value: 0 },
    email: { checked: true, value: 0 },
    faixa_valor: { checked: true, value: 0 },
    tema_interesse: { checked: true, value: 0 },
    instituicao: { checked: true, value: 0 },
    unidade_executora: { checked: true, value: 0 },
    linha_pesquisa: { checked: true, value: 0 },
    inicio_previsto: { checked: true, value: 0 },
    duracao: { checked: true, value: 0 },
    cotacao_moeda_estrangeira: { checked: true, value: 0 },
  });

  const [loadingHeader, setLoadingHeader] = useState(false);
  const [loadingAttachment, setLoadingAttachment] = useState(false);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Configurar Edital';

    api.get(`configurations`).then(({ data }) => {
      setFields(JSON.parse(data.plano_trabalho).fields);
      setAnexo(JSON.parse(data.plano_trabalho));
    }).catch((error) => console.log(error));
  }, []);

  const handleSubmitHeader = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          size: Yup.number().required('Campo obrigatório').min(1, 'Valor deve ser maior ou igual a 1'),
          quantity: Yup.number().required('Campo obrigatório').min(0, 'Valor deve ser maior ou igual a 0'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoadingHeader(true);

        api.post(`configurations`, {
          plano_trabalho: JSON.stringify({ ...data, fields }),
        }).then(({ data }) => {
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
    [fields],
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
            <h3>Plano de trabalho</h3>
          </div>
          <div className="card-body">
            <Unform initialData={anexo} ref={formRef} onSubmit={handleSubmitHeader}>
              <Form>
                <div>
                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, titulo_projeto: { ...fields.titulo_projeto, checked: !fields.titulo_projeto.checked } })}
                      checked={fields.titulo_projeto.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Título do projeto"
                    />

                    {/* <Input type="number" disabled={!fields.titulo_projeto.checked} formRef={formRef} name="title" original /> */}
                  </div>

                  {/* <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, coordenador: { ...fields.coordenador, checked: !fields.coordenador.checked } })}
                      checked={fields.coordenador.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Coordenador"
                    />

                    <Input type="number" disabled={!fields.coordenador.checked} formRef={formRef} name="coordenator" original />
                  </div> */}

                  {/* <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, email: { ...fields.email, checked: !fields.email.checked } })}
                      checked={fields.email.checked}
                      fields={fields}
                      setFields={setFields}
                      title="E-mail"
                    />

                    <Input type="number" disabled={!fields.email.checked} formRef={formRef} name="email" original />
                  </div> */}

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, faixa_valor: { ...fields.faixa_valor, checked: !fields.faixa_valor.checked } })}
                      checked={fields.faixa_valor.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Faixa de valor"
                    />

                    {/* <Input type="number" disabled={!fields.faixa_valor.checked} formRef={formRef} name="faixa_value" original /> */}
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, tema_interesse: { ...fields.tema_interesse, checked: !fields.tema_interesse.checked } })}
                      checked={fields.tema_interesse.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Tema de interesse"
                    />

                    {/* <Input type="number" disabled={!fields.faixa_valor.checked} formRef={formRef} name="faixa_value" original /> */}
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, instituicao: { ...fields.instituicao, checked: !fields.instituicao.checked } })}
                      checked={fields.instituicao.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Instituição Executora"
                    />

                    {/* <Input type="number" disabled={!fields.instituicao.checked} formRef={formRef} name="line_reseacher" original /> */}
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, unidade_executora: { ...fields.unidade_executora, checked: !fields.unidade_executora.checked } })}
                      checked={fields.unidade_executora.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Unidade Executora"
                    />

                    {/* <Input type="number" disabled={!fields.unidade_executora.checked} formRef={formRef} name="unit_execution" original /> */}
                  </div>

                  {/* <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, linha_pesquisa: { ...fields.linha_pesquisa, checked: !fields.linha_pesquisa.checked } })}
                      checked={fields.linha_pesquisa.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Linha de pesquisa"
                    />

                    <Input type="number" disabled={!fields.linha_pesquisa.checked} formRef={formRef} name="line_reseacher" original />
                  </div> */}

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, inicio_previsto: { ...fields.inicio_previsto, checked: !fields.inicio_previsto.checked } })}
                      checked={fields.inicio_previsto.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Início previsto"
                    />

                    {/* <Input type="number" disabled={!fields.duracao.checked} formRef={formRef} name="duration" original /> */}
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, duracao: { ...fields.duracao, checked: !fields.duracao.checked } })}
                      checked={fields.duracao.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Duração"
                    />

                    {/* <Input type="number" disabled={!fields.duracao.checked} formRef={formRef} name="duration" original /> */}
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, cotacao_moeda_estrangeira: { ...fields.cotacao_moeda_estrangeira, checked: !fields.cotacao_moeda_estrangeira.checked } })}
                      checked={fields.cotacao_moeda_estrangeira.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Cotação da Moeda Estrangeira"
                    />

                    {/* <Input type="number" disabled={!fields.cotacao_moeda_estrangeira.checked} formRef={formRef} name="duration" original /> */}
                  </div>
                </div>

                <h3 style={{ color: '#48465b' }}>Anexo</h3>

                <Input formRef={formRef} name="name" original title="Nome" />

                <Input formRef={formRef} name="size" type="number" original title="Tamanho máximo (Mb)" />

                <Input formRef={formRef} name="quantity" type="number" original title="Número máximo" />

                <div className="modal-footer">
                  {loadingHeader ? (<ReactLoading type="spin" height="50px" width="50px" color="#3699ff" />) : (
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

        {/* <Card className="red">
          <div className="card-title">
            <h3>Anexo</h3>
          </div>
          <div className="card-body">
            <Unform ref={formRef} onSubmit={handleSubmitAttachment}>
              <Form>
                <Input formRef={formRef} name="name" original title="Nome" />

                <Input formRef={formRef} name="size" type="number" original title="Tamanho máximo (Mb)" />

                <Input formRef={formRef} name="quantity" type="number" original title="Número máximo" />

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
        </Card> */}
      </div>
    </>
  );
}
