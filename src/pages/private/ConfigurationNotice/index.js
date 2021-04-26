import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';

import * as Yup from 'yup';

import ReactLoading from "react-loading";

import { Form as Unform } from '@unform/web';
import { store } from 'react-notifications-component';
import { useParams } from 'react-router-dom';
import { Button } from '../../../components/Button';

import { Form } from '../../../components/Form';
import Input from '../../../components/Input';
import { Card } from '../../../components/Card';

import getValidationErrors from '../../../utils/getValidationErrors';

import Checkbox from './components/Checkbox';

import api from '../../../services/api';

export default function ConfigurationNotice() {
  const formRef = useRef(null);

  const { id } = useParams();

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

  const [apresentacao, setApresentacao] = useState({
    resumo: { checked: true, value: 0 },
    palavras_chave: { checked: true, value: 0 },
    informacoes_relevantes_para_avaliacao: { checked: true, value: 0 },
    experiencia_coordenador: { checked: true, value: 0 },
    sintese_projeto: { checked: true, value: 0 },
    objetivos_gerais: { checked: true, value: 0 },
    objetivos_especificos: { checked: true, value: 0 },
    metodologia: { checked: true, value: 0 },
    resultados_esperados: { checked: true, value: 0 },
    impactos_esperados: { checked: true, value: 0 },
    riscos_atividades: { checked: true, value: 0 },
    referencia_bibliografica: { checked: true, value: 0 },
    estado_arte: { checked: true, value: 0 },
  });

  const [loadingHeader, setLoadingHeader] = useState(false);
  const [loadingApresentacao, setLoadingApresentacao] = useState(false);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Configurar Edital';

    api.get(`configurations`, {
      params: {
        edital_id: id,
      },
    }).then(({ data }) => {
      setFields(JSON.parse(data.plano_trabalho).fields);
      setApresentacao(JSON.parse(data.apresentacao).apresentacao);
      setAnexo(JSON.parse(data.plano_trabalho));
    }).catch((error) => console.log(error));
  }, [id]);

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
          file_id: id,
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
    [fields, id],
  );

  const handleSubmitApresentacao = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        setLoadingApresentacao(true);

        api.post(`configurations`, {
          apresentacao: JSON.stringify({ ...data, apresentacao }),
          file_id: id,
        }).then(({ data }) => {
          setLoadingApresentacao(false);

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
    [apresentacao, id],
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
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, faixa_valor: { ...fields.faixa_valor, checked: !fields.faixa_valor.checked } })}
                      checked={fields.faixa_valor.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Faixa de valor"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, tema_interesse: { ...fields.tema_interesse, checked: !fields.tema_interesse.checked } })}
                      checked={fields.tema_interesse.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Tema de interesse"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, instituicao: { ...fields.instituicao, checked: !fields.instituicao.checked } })}
                      checked={fields.instituicao.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Instituição Executora"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, unidade_executora: { ...fields.unidade_executora, checked: !fields.unidade_executora.checked } })}
                      checked={fields.unidade_executora.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Unidade Executora"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, inicio_previsto: { ...fields.inicio_previsto, checked: !fields.inicio_previsto.checked } })}
                      checked={fields.inicio_previsto.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Início previsto"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, duracao: { ...fields.duracao, checked: !fields.duracao.checked } })}
                      checked={fields.duracao.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Duração"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setFields({ ...fields, cotacao_moeda_estrangeira: { ...fields.cotacao_moeda_estrangeira, checked: !fields.cotacao_moeda_estrangeira.checked } })}
                      checked={fields.cotacao_moeda_estrangeira.checked}
                      fields={fields}
                      setFields={setFields}
                      title="Cotação da Moeda Estrangeira"
                    />
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

        <Card className="red">
          <div className="card-title">
            <h3>Apresentação</h3>
          </div>
          <div className="card-body">
            <Unform ref={formRef} onSubmit={handleSubmitApresentacao}>
              <Form>
                <div>
                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, resumo: { ...apresentacao.resumo, checked: !apresentacao.resumo.checked } })}
                      checked={apresentacao.resumo.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Resumo da proposta"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, palavras_chave: { ...apresentacao.palavras_chave, checked: !apresentacao.palavras_chave.checked } })}
                      checked={apresentacao.palavras_chave.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Palavras-Chave"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, informacoes_relevantes_para_avaliacao: { ...apresentacao.informacoes_relevantes_para_avaliacao, checked: !apresentacao.informacoes_relevantes_para_avaliacao.checked } })}
                      checked={apresentacao.informacoes_relevantes_para_avaliacao.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Informações Relevantes para Avaliação da Proposta"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, experiencia_coordenador: { ...apresentacao.experiencia_coordenador, checked: !apresentacao.experiencia_coordenador.checked } })}
                      checked={apresentacao.experiencia_coordenador.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Experiência do Coordenador"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, sintese_projeto: { ...apresentacao.sintese_projeto, checked: !apresentacao.sintese_projeto.checked } })}
                      checked={apresentacao.sintese_projeto.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Síntese do Projeto"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, objetivos_gerais: { ...apresentacao.objetivos_gerais, checked: !apresentacao.objetivos_gerais.checked } })}
                      checked={apresentacao.objetivos_gerais.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Objetivos Gerais"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, objetivos_especificos: { ...apresentacao.objetivos_especificos, checked: !apresentacao.objetivos_especificos.checked } })}
                      checked={apresentacao.objetivos_especificos.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Objetivo Específico"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, metodologia: { ...apresentacao.metodologia, checked: !apresentacao.metodologia.checked } })}
                      checked={apresentacao.metodologia.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Metodologia"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, resultados_esperados: { ...apresentacao.resultados_esperados, checked: !apresentacao.resultados_esperados.checked } })}
                      checked={apresentacao.resultados_esperados.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Resultados Esperados"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, impactos_esperados: { ...apresentacao.impactos_esperados, checked: !apresentacao.impactos_esperados.checked } })}
                      checked={apresentacao.impactos_esperados.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Impactos Esperados"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, riscos_atividades: { ...apresentacao.riscos_atividades, checked: !apresentacao.riscos_atividades.checked } })}
                      checked={apresentacao.riscos_atividades.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Riscos e Atividades"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, referencia_bibliografica: { ...apresentacao.referencia_bibliografica, checked: !apresentacao.referencia_bibliografica.checked } })}
                      checked={apresentacao.referencia_bibliografica.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Referência Bibliográfica"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setApresentacao({ ...apresentacao, estado_arte: { ...apresentacao.estado_arte, checked: !apresentacao.estado_arte.checked } })}
                      checked={apresentacao.estado_arte.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Estado da Arte"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  {loadingApresentacao ? (<ReactLoading type="spin" height="50px" width="50px" color="#3699ff" />) : (
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
