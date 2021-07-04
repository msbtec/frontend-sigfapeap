import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';

import * as Yup from 'yup';

import { isUuid, uuid } from 'uuidv4';

import ReactLoading from "react-loading";

import { Form as Unform } from '@unform/web';
import { store } from 'react-notifications-component';
import { useParams } from 'react-router-dom';
import { FiFile, FiTrash } from 'react-icons/fi';
import { AiOutlineFilePdf } from 'react-icons/ai';
import {
  money_mask,
} from '../../../utils/validations';
import { Content } from './styles';
import { Button } from '../../../components/Button';

import { Form } from '../../../components/Form';
import { Card } from '../../../components/Card';

import getValidationErrors from '../../../utils/getValidationErrors';

import Checkbox from './components/Checkbox';

import api from '../../../services/api';

export default function ConfigurationNotice() {
  const formRef = useRef(null);

  const { id } = useParams();

  const [personalFiles, setPersonalFiles] = useState([]);
  const [files, setFiles] = useState([]);

  const [anexo, setAnexo] = useState(null);
  const [fields, setFields] = useState({
    titulo_projeto: { checked: true, value: 0 },
    coordenador: { checked: true, value: 0 },
    email: { checked: true, value: 0 },
    faixa_valor: { checked: true, value: [] },
    tema_interesse: { checked: true, value: 0 },
    instituicao: { checked: true, value: 0 },
    unidade_executora: { checked: true, value: 0 },
    linha_pesquisa: { checked: true, value: 0 },
    inicio_previsto: { checked: true, value: 0 },
    duracao: { checked: true, value: 0 },
    cotacao_moeda_estrangeira: { checked: true, value: [] },
  });

  const [orcamentos, setOrcamentos] = useState({
    diarias: { checked: true, value: 0 },
    hospedagem_alimentacao: { checked: true, value: 0 },
    materiais_consumo: { checked: true, value: 0 },
    passagens: { checked: true, value: 0 },
    servicos_terceiros: { checked: true, value: 0 },
    materiais_equipamentos: { checked: true, value: 0 },
    pessoal: { checked: true, value: 0 },
    bolsas: { checked: true, value: [] },
    encargos: { checked: true, value: 0 },
  });

  const [abrangencias, setAbrangencias] = useState({
    abrangencia: { checked: true, value: 0 },
  });

  const [equipes, setEquipes] = useState({
    equipe: { checked: true, value: 0 },
  });

  const [recursos, setRecursos] = useState({
    recurso: { checked: true, value: 0 },
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
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [loadingPersonalDocuments, setLoadingPersonalDocuments] = useState(false);
  const [loadingApresentacao, setLoadingApresentacao] = useState(false);
  const [loadingOrcamento, setLoadingOrcamento] = useState(false);
  const [loadingAbrangencia, setLoadingAbrangencia] = useState(false);
  const [loadingEquipe, setLoadingEquipe] = useState(false);
  const [loadingRecurso, setLoadingRecurso] = useState(false);

  async function getConfigurations() {
    api.get(`configurations`, {
      params: {
        edital_id: id,
      },
    }).then(({ data }) => {
      setFields(JSON.parse(data.plano_trabalho).fields);
      setPersonalFiles(JSON.parse(data.plano_trabalho).documentos_pessoais);
      setApresentacao(JSON.parse(data.apresentacao).apresentacao);
      setOrcamentos(JSON.parse(data.orcamento).orcamentos);
      setAbrangencias(JSON.parse(data.abrangencia).abrangencias);
      setEquipes(JSON.parse(data.membros).equipes);
      setRecursos(JSON.parse(data.recursos_solicitados_outros).recursos);
      setAnexo(JSON.parse(data.plano_trabalho));
      setFiles(data.files.map((item) => ({
        id: item.id,
        title: item.title,
        file: { name: 'Selecione para alterar anexo', url: item.url },
      })));
    }).catch((error) => console.log(error));
  }

  useEffect(() => {
    document.title = 'SIGFAPEAP - Configurar Chamada Pública';

    getConfigurations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmitHeader = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        setLoadingHeader(true);

        let isOne = false;
        if (fields.titulo_projeto.checked || fields.faixa_valor.checked || fields.tema_interesse.checked || fields.instituicao.checked || fields.inicio_previsto.checked || fields.duracao.checked || fields.cotacao_moeda_estrangeira.checked) {
          isOne = true;
        }

        api.post(`configurations`, {
          plano_trabalho: JSON.stringify({
            ...data, fields, documentos_pessoais: personalFiles, isOne,
          }),
          file_id: id,
        }).then(({ data }) => {
          setLoadingHeader(false);

          getConfigurations();

          store.addNotification({
            message: `Chamada Pública configurada com sucesso!`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields, id],
  );

  async function handleSubmitDocuments(title, file) {
    try {
      const formData = new FormData();

      formData.append('title', title);
      formData.append('file_id', id);

      if (file) {
        formData.append('file', file);
      }

      setLoadingDocuments(true);

      api.post('configurations/documents', formData).then(({ data }) => {
        setLoadingDocuments(false);

        getConfigurations();

        store.addNotification({
          message: `Documento inserido com sucesso!`,
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
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current.setErrors(errors);
      }
    }
  }

  const handleSubmitPersonalDocuments = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        setLoadingPersonalDocuments(true);

        api.post(`configurations`, {
          plano_trabalho: JSON.stringify({ fields, documentos_pessoais: personalFiles }),
          file_id: id,
        }).then(({ data }) => {
          setLoadingPersonalDocuments(false);

          getConfigurations();

          store.addNotification({
            message: `Chamada Pública configurada com sucesso!`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields, personalFiles, id],
  );

  // eslint-disable-next-line consistent-return
  async function handleUpdateDocuments(id, title, file) {
    try {
      const formData = new FormData();

      if (isUuid(String(id))) {
        return null;
      }

      formData.append('title', title);

      if (file) {
        formData.append('file', file);
      }

      setLoadingDocuments(true);

      api.put(`configurations/documents/${id}`, formData).then(({ data }) => {
        setLoadingDocuments(false);

        if (file) {
          getConfigurations();

          store.addNotification({
            message: `Documento atualizado com sucesso!`,
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
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current.setErrors(errors);
      }
    }
  }

  const handleSubmitApresentacao = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        setLoadingApresentacao(true);

        let isOne = false;
        if (apresentacao.resumo.checked
            || apresentacao.palavras_chave.checked
            || apresentacao.informacoes_relevantes_para_avaliacao.checked
            || apresentacao.experiencia_coordenador.checked
            || apresentacao.sintese_projeto.checked
            || apresentacao.objetivos_gerais.checked
            || apresentacao.objetivos_especificos.checked
            || apresentacao.metodologia.checked
            || apresentacao.resultados_esperados.checked
            || apresentacao.impactos_esperados.checked
            || apresentacao.riscos_atividades.checked
            || apresentacao.referencia_bibliografica.checked
            || apresentacao.estado_arte.checked) {
          isOne = true;
        }

        api.post(`configurations`, {
          apresentacao: JSON.stringify({ ...data, apresentacao, isOne }),
          file_id: id,
        }).then(({ data }) => {
          setLoadingApresentacao(false);

          getConfigurations();

          store.addNotification({
            message: `Chamada Pública configurada com sucesso!`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apresentacao, id],
  );

  const handleSubmitOrcamento = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        setLoadingOrcamento(true);

        let isOne = false;
        if (orcamentos.diarias.checked
            || orcamentos.hospedagem_alimentacao.checked
            || orcamentos.materiais_consumo.checked
            || orcamentos.passagens.checked
            || orcamentos.servicos_terceiros.checked
            || orcamentos.materiais_equipamentos.checked
            || orcamentos.pessoal.checked
            || orcamentos.bolsas.checked
            || orcamentos.encargos.checked) {
          isOne = true;
        }

        api.post(`configurations`, {
          orcamento: JSON.stringify({ ...data, orcamentos, isOne }),
          file_id: id,
        }).then(({ data }) => {
          setLoadingOrcamento(false);

          getConfigurations();

          store.addNotification({
            message: `Chamada Pública configurada com sucesso!`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orcamentos, id],
  );

  const handleSubmitAbrangencia = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        setLoadingAbrangencia(true);

        api.post(`configurations`, {
          abrangencia: JSON.stringify({ ...data, abrangencias }),
          file_id: id,
        }).then(({ data }) => {
          setLoadingAbrangencia(false);

          getConfigurations();

          store.addNotification({
            message: `Chamada Pública configurada com sucesso!`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [abrangencias, id],
  );

  const handleSubmitEquipe = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        setLoadingEquipe(true);

        api.post(`configurations`, {
          membros: JSON.stringify({ ...data, equipes }),
          file_id: id,
        }).then(({ data }) => {
          setLoadingEquipe(false);

          getConfigurations();

          store.addNotification({
            message: `Chamada Pública configurada com sucesso!`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [equipes, id],
  );

  const handleSubmitRecurso = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        setLoadingRecurso(true);

        api.post(`configurations`, {
          recursos_solicitados_outros: JSON.stringify({ ...data, recursos }),
          file_id: id,
        }).then(({ data }) => {
          setLoadingRecurso(false);

          getConfigurations();

          store.addNotification({
            message: `Chamada Pública configurada com sucesso!`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recursos, id],
  );

  return (
    <>
      <div className="col-12 title">
        <h1>Configurar Chamada Pública</h1>
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

                    {fields.faixa_valor.checked
                    && (
                    <div style={{
                      display: "flex", flexDirection: "column",
                    }}
                    >
                        {fields.faixa_valor.value.map((item, i) => (
                          <div style={{
                            display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'center',
                          }}
                          >
                            <div className="input-block">
                              <label className="required">Mínimo</label>
                              <input
                                onChange={(e) => setFields({
                                  ...fields,
                                  faixa_valor: {
                                    ...fields.faixa_valor,
                                    value: fields.faixa_valor.value.map((field) => (field.id == item.id ? ({
                                      ...field, min: money_mask(e.target.value),
                                    }) : field)),
                                  },
                                })}
                                value={item.min}
                                type="text"
                              />
                            </div>

                            <div style={{ marginBottom: 15, marginLeft: 10 }} className="input-block">
                              <label className="required">Máximo</label>
                              <input
                                onChange={(e) => setFields({
                                  ...fields,
                                  faixa_valor: {
                                    ...fields.faixa_valor,
                                    value: fields.faixa_valor.value.map((field) => (field.id == item.id ? ({
                                      ...field, max: money_mask(e.target.value),
                                    }) : field)),
                                  },
                                })}
                                value={item.max}
                                type="text"
                              />
                            </div>

                            <Content>
                              <button
                                style={{ width: 50, marginTop: 25, marginLeft: 10 }}
                                type="button"
                                onClick={() => {
                                  if (i == fields.faixa_valor.value.length - 1) {
                                    setFields({
                                      ...fields,
                                      faixa_valor: {
                                        ...fields.faixa_valor,
                                        value: [...fields.faixa_valor.value, {
                                          id: uuid(),
                                          min: 'R$ 0,00',
                                          max: 'R$ 0,00',
                                        }],
                                      },
                                    });
                                  } else {
                                    const result = fields.faixa_valor.value;
                                    result.splice(i, 1);
                                    setFields({ ...fields, faixa_valor: { ...fields.faixa_valor, value: result } });
                                  }
                                }}
                              >
                                {(i == fields.faixa_valor.value.length - 1) ? '+' : '-'}
                              </button>
                            </Content>
                          </div>
                        ))}
                    </div>
                    )}
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

                    {fields.cotacao_moeda_estrangeira.checked
                    && (
                    <div className="input-block">
                      <label className="required">Valor</label>
                      <input
                        onChange={(e) => setFields({ ...fields, cotacao_moeda_estrangeira: { ...fields.cotacao_moeda_estrangeira, value: money_mask(e.target.value) } })}
                        value={fields.cotacao_moeda_estrangeira.value}
                        type="text"
                      />
                    </div>
                    )}
                  </div>
                </div>

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
            <h3>Documentos Pessoais</h3>
          </div>
          <div className="card-body">
            <Unform ref={formRef} onSubmit={handleSubmitPersonalDocuments}>
              <Form ref={formRef} onSubmit={handleSubmitPersonalDocuments}>
                <div>
                  {personalFiles.map((item, index) => (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ marginBottom: 10 }} className="input-block">
                        <label className="required">Título</label>
                        <input
                          value={item.title}
                          onChange={(e) => {
                            setPersonalFiles(personalFiles.map((file, subindex) => (index == subindex ? ({ ...file, title: e.target.value }) : file)));
                          }}
                          type="text"
                        />
                      </div>

                      <div style={{ display: 'flex' }}>
                        <FiTrash
                          onClick={() => {
                            setPersonalFiles(personalFiles.filter((file) => file.id !== item.id));
                          }}
                          style={{
                            fontSize: 25, marginTop: 10, marginLeft: 20, marginRight: 20, cursor: 'pointer',
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <Content>
                    <button
                      style={{ marginTop: 20, marginBottom: 20, width: 210 }}
                      type="button"
                      onClick={() => {
                        setPersonalFiles([...personalFiles, {
                          id: uuid(),
                          title: '',
                        }]);
                      }}
                    >
                      Adicionar documento
                    </button>
                  </Content>
                </div>

                <div className="modal-footer">
                  {loadingPersonalDocuments ? (<ReactLoading type="spin" height="50px" width="50px" color="#3699ff" />) : (
                    <Button
                      type="submit"
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
            <h3>Outros documentos</h3>
          </div>
          <div className="card-body">
            <Form>
              <div>
                {files.map((item, index) => (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ marginBottom: 10 }} className="input-block">
                      <label className="required">Título</label>
                      <input
                        value={item.title}
                        onChange={(e) => {
                          setFiles(files.map((file, subindex) => (index == subindex ? ({ ...file, title: e.target.value }) : file)));
                          handleUpdateDocuments(item.id, e.target.value, null);
                        }}
                        type="text"
                      />
                    </div>

                    <div className="input-block" style={{ marginLeft: 10, marginBottom: 25 }}>
                      <label htmlFor="email">
                        Anexo
                      </label>
                      <div style={{ marginBottom: 5 }} />
                      <label className="file-input">
                        <input
                          type="file"
                          placeholder="Arquivo"
                          accept=".pdf"
                          onChange={(e) => {
                            if (e.target.files.length > 0) {
                              if (e.target.files[0].size / 1000000 > 3) {
                                store.addNotification({
                                  message: `Seu arquivo: ${e.target.files[0].name} é muito grande! Max:3MB`,
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
                              } else {
                                setFiles(files.map((file, subindex) => (index == subindex ? ({ ...file, file: e.target.files[0] }) : file)));
                                if (isUuid(String(item.id))) {
                                  handleSubmitDocuments(item.title, e.target.files[0]);
                                } else {
                                  handleUpdateDocuments(item.id, item.title, e.target.files[0]);
                                }
                              }
                            }
                          }}
                        />
                        <div className="text">
                          {files.length > 0 && files[index].file.name || 'Selecione anexo'}
                        </div>
                        <div className="icon">
                          <FiFile />
                        </div>
                      </label>
                    </div>

                    <div style={{ display: 'flex' }}>
                      <AiOutlineFilePdf
                        onClick={() => item.file.name && window.open(item.file.url || window.URL.createObjectURL(item.file), '__blank')}
                        style={{
                          fontSize: 25, marginTop: 10, marginLeft: 20, cursor: 'pointer',
                        }}
                      />

                      <FiTrash
                        onClick={() => {
                          api.delete(`configurations/documents/${item.id}`).then(({ data }) => {
                            setFiles(files.filter((file) => file.id !== item.id));

                            store.addNotification({
                              message: `Documento removido com sucesso!`,
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
                          });
                        }}
                        style={{
                          fontSize: 25, marginTop: 10, marginLeft: 20, marginRight: 20, cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>
                ))}

                <Content>
                  <button
                    style={{ marginTop: 20, marginBottom: 20, width: 210 }}
                    type="button"
                    onClick={() => {
                      setFiles([...files, {
                        id: uuid(),
                        title: '',
                        file: { name: null },
                      }]);
                    }}
                  >
                    Adicionar documento
                  </button>
                </Content>
              </div>
            </Form>
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
                      onChange={() => setApresentacao({ ...apresentacao, estado_arte: { ...apresentacao.estado_arte, checked: !apresentacao.estado_arte.checked } })}
                      checked={apresentacao.estado_arte.checked}
                      fields={apresentacao}
                      setFields={setApresentacao}
                      title="Estado da Arte"
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

        <Card className="red">
          <div className="card-title">
            <h3>Orçamentos</h3>
          </div>
          <div className="card-body">
            <Unform ref={formRef} onSubmit={handleSubmitOrcamento}>
              <Form>
                <div>
                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setOrcamentos({ ...orcamentos, diarias: { ...orcamentos.diarias, checked: !orcamentos.diarias.checked } })}
                      checked={orcamentos.diarias.checked}
                      fields={orcamentos}
                      setFields={setOrcamentos}
                      title="Diária(s)"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setOrcamentos({ ...orcamentos, hospedagem_alimentacao: { ...orcamentos.hospedagem_alimentacao, checked: !orcamentos.hospedagem_alimentacao.checked } })}
                      checked={orcamentos.hospedagem_alimentacao.checked}
                      fields={orcamentos}
                      setFields={setOrcamentos}
                      title="Hospedagem/Alimentação"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setOrcamentos({ ...orcamentos, materiais_consumo: { ...orcamentos.materiais_consumo, checked: !orcamentos.materiais_consumo.checked } })}
                      checked={orcamentos.materiais_consumo.checked}
                      fields={orcamentos}
                      setFields={setOrcamentos}
                      title="Materiais de Consumo"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setOrcamentos({ ...orcamentos, passagens: { ...orcamentos.passagens, checked: !orcamentos.passagens.checked } })}
                      checked={orcamentos.passagens.checked}
                      fields={orcamentos}
                      setFields={setOrcamentos}
                      title="Passagens"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setOrcamentos({ ...orcamentos, servicos_terceiros: { ...orcamentos.servicos_terceiros, checked: !orcamentos.servicos_terceiros.checked } })}
                      checked={orcamentos.servicos_terceiros.checked}
                      fields={orcamentos}
                      setFields={setOrcamentos}
                      title="Serviços de Terceiros"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setOrcamentos({ ...orcamentos, materiais_equipamentos: { ...orcamentos.materiais_equipamentos, checked: !orcamentos.materiais_equipamentos.checked } })}
                      checked={orcamentos.materiais_equipamentos.checked}
                      fields={orcamentos}
                      setFields={setOrcamentos}
                      title="Materiais Permanentes e Equipamentos"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setOrcamentos({ ...orcamentos, pessoal: { ...orcamentos.pessoal, checked: !orcamentos.pessoal.checked } })}
                      checked={orcamentos.pessoal.checked}
                      fields={orcamentos}
                      setFields={setOrcamentos}
                      title="Pessoal"
                    />
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setOrcamentos({ ...orcamentos, bolsas: { ...orcamentos.bolsas, checked: !orcamentos.bolsas.checked } })}
                      checked={orcamentos.bolsas.checked}
                      fields={orcamentos}
                      setFields={setOrcamentos}
                      title="Bolsas"
                    />

                    {orcamentos.bolsas.checked
                    && (
                    <div style={{
                      display: "flex", flexDirection: "column",
                    }}
                    >
                        {orcamentos.bolsas.value.map((item, i) => (
                          <div style={{
                            display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'center',
                          }}
                          >
                            <div className="input-block">
                              <label className="required">Título</label>
                              <input
                                onChange={(e) => setOrcamentos({
                                  ...orcamentos,
                                  bolsas: {
                                    ...orcamentos.bolsas,
                                    value: orcamentos.bolsas.value.map((field) => (field.id == item.id ? ({
                                      ...field, title: e.target.value,
                                    }) : field)),
                                  },
                                })}
                                value={item.title}
                                type="text"
                              />
                            </div>

                            <div style={{ marginBottom: 15, marginLeft: 10 }} className="input-block">
                              <label className="required">Mínimo</label>
                              <input
                                onChange={(e) => setOrcamentos({
                                  ...orcamentos,
                                  bolsas: {
                                    ...orcamentos.bolsas,
                                    value: orcamentos.bolsas.value.map((field) => (field.id == item.id ? ({
                                      ...field, min: money_mask(e.target.value),
                                    }) : field)),
                                  },
                                })}
                                value={item.min}
                                type="text"
                              />
                            </div>

                            <div style={{ marginBottom: 15, marginLeft: 10 }} className="input-block">
                              <label className="required">Máximo</label>
                              <input
                                onChange={(e) => setOrcamentos({
                                  ...orcamentos,
                                  bolsas: {
                                    ...orcamentos.bolsas,
                                    value: orcamentos.bolsas.value.map((field) => (field.id == item.id ? ({
                                      ...field, max: money_mask(e.target.value),
                                    }) : field)),
                                  },
                                })}
                                value={item.max}
                                type="text"
                              />
                            </div>

                            <Content>
                              <button
                                style={{ width: 50, marginTop: 25, marginLeft: 10 }}
                                type="button"
                                onClick={() => {
                                  if (i == orcamentos.bolsas.value.length - 1) {
                                    setOrcamentos({
                                      ...orcamentos,
                                      bolsas: {
                                        ...orcamentos.bolsas,
                                        value: [...orcamentos.bolsas.value, {
                                          id: uuid(),
                                          title: '',
                                          min: 'R$ 0,00',
                                          max: 'R$ 0,00',
                                        }],
                                      },
                                    });
                                  } else {
                                    const result = orcamentos.bolsas.value;
                                    result.splice(i, 1);
                                    setOrcamentos({ ...orcamentos, bolsas: { ...orcamentos.bolsas, value: result } });
                                  }
                                }}
                              >
                                {(i == orcamentos.bolsas.value.length - 1) ? '+' : '-'}
                              </button>
                            </Content>
                          </div>
                        ))}
                    </div>
                    )}
                  </div>

                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setOrcamentos({ ...orcamentos, encargos: { ...orcamentos.encargos, checked: !orcamentos.encargos.checked } })}
                      checked={orcamentos.encargos.checked}
                      fields={orcamentos}
                      setFields={setOrcamentos}
                      title="Encargos"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  {loadingOrcamento ? (<ReactLoading type="spin" height="50px" width="50px" color="#3699ff" />) : (
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
            <h3>Abrangência</h3>
          </div>
          <div className="card-body">
            <Unform ref={formRef} onSubmit={handleSubmitAbrangencia}>
              <Form>
                <div>
                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setAbrangencias({ ...abrangencias, abrangencia: { ...abrangencias.abrangencia, checked: !abrangencias.abrangencia.checked } })}
                      checked={abrangencias.abrangencia.checked}
                      fields={abrangencias}
                      setFields={setAbrangencias}
                      title="Abrangência"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  {loadingAbrangencia ? (<ReactLoading type="spin" height="50px" width="50px" color="#3699ff" />) : (
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
            <h3>Equipe</h3>
          </div>
          <div className="card-body">
            <Unform ref={formRef} onSubmit={handleSubmitEquipe}>
              <Form>
                <div>
                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setEquipes({ ...equipes, equipe: { ...equipes.equipe, checked: !equipes.equipe.checked } })}
                      checked={equipes.equipe.checked}
                      fields={equipes}
                      setFields={setEquipes}
                      title="Membro(s) e Atividades"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  {loadingEquipe ? (<ReactLoading type="spin" height="50px" width="50px" color="#3699ff" />) : (
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
            <h3>Recursos</h3>
          </div>
          <div className="card-body">
            <Unform ref={formRef} onSubmit={handleSubmitRecurso}>
              <Form>
                <div>
                  <div style={{ marginRight: 10, marginBottom: 20 }}>
                    <Checkbox
                      onChange={() => setRecursos({ ...recursos, recurso: { ...recursos.recurso, checked: !recursos.recurso.checked } })}
                      checked={recursos.recurso.checked}
                      fields={recursos}
                      setFields={setRecursos}
                      title="Recursos Solicitados a Outras Fontes, Parcerias e/ou Contrapartida da(s) Instituição(ões) Envolvida(s)"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  {loadingRecurso ? (<ReactLoading type="spin" height="50px" width="50px" color="#3699ff" />) : (
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
