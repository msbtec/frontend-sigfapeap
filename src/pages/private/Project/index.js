import React, {
  useEffect, useState, useRef, useCallback, Suspense, lazy,
} from 'react';

import * as Yup from 'yup';

import { isUuid, uuid } from 'uuidv4';

import ReactLoading from "react-loading";

import ReactTooltip from 'react-tooltip';

import { ModalProvider } from 'styled-react-modal';

import { FiDownloadCloud } from 'react-icons/fi';

import moment from 'moment';

import { useParams } from 'react-router-dom';

import { Form as Unform } from '@unform/web';
import { store } from 'react-notifications-component';

import { Button } from '../../../components/Button';

import { Content } from './styles';

import { useAuth } from '../../../hooks/auth';
import { useProject } from '../../../hooks/project';

import { Card } from '../../../components/Card';

import Header from './Tabs/Header';
import Document from './Tabs/Document';
import Appresentation from './Tabs/Appresentation';
import Abrangencia from './Tabs/Abrangencia';
import Recursos from './Tabs/Recursos';
import Equipe from './Tabs/Equipe';
import Orcamento from './Tabs/Orcamento';

import Breadcumb from './Components/Breadcumb';

import Avaliacao from './Avaliacao';
import Homologacao from './Homologacao';

import getValidationErrors from '../../../utils/getValidationErrors';

import {
  getValue,
} from '../../../utils/soma';

import {
  money_mask,
} from '../../../utils/validations';

import api from '../../../services/api';

let ModalConfirm = () => <></>;
let ModalHomologar = () => <></>;
let ModalContratar = () => <></>;
let ModalForm = () => <></>;
let ModalEvaluation = () => <></>;

export default function Project() {
  const formRef = useRef(null);

  const { user } = useAuth();

  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [OpenHomologar, setOpenHomologar] = useState(false);
  const [OpenContratar, setOpencontratar] = useState(false);

  const {
    project, membros, atividades, plano, despesas, setDespesas, recursos, abrangencias,
    orcamentos, setOrcamentos, loading: pageLoading, setLoading: setPageLoading,
    configuration, getProject: getProjectInformations,
  } = useProject();

  const [screen, setScreen] = useState({
    header: true,
    appresentation: false,
    documents: false,
    abrangencia: false,
    recursos: false,
    equipe: false,
    orcamento: false,
  });

  const [initiaLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [avaliacao, setAvaliacao] = useState(false);
  const [homologacao, setHomologacao] = useState(false);

  const [files, setFiles] = useState([]);
  const [edital, setEdital] = useState({ title: '' });
  const [protocolo, setProtocolo] = useState(uuid());
  const { id, coordenador } = useParams();

  const [OpenForm, setOpenForm] = useState(false);
  const [OpenEvaluation, setOpenEvaluation] = useState(false);

  async function toggleModalForm() {
    ModalForm = await lazy(() => import("./Modal"));

    setOpenForm(!OpenForm);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
  }

  async function toggleModalEvaluation() {
    ModalEvaluation = await lazy(() => import("./ModalEvaluation"));

    setOpenEvaluation(!OpenEvaluation);
  }

  function submitModalEvaluation() {
    setOpenEvaluation(!OpenEvaluation);
    setAvaliacao(false);
  }

  async function getProject() {
    getProjectInformations(
      id,
      coordenador,
      setFiles,
      setInitialLoading,
      setProtocolo,
    );
  }

  useEffect(() => {
    document.title = 'SIGFAPEAP - Projeto';

    setPageLoading(true);

    getProject();

    api.get(`/programs/files/edital/${id}`).then(({ data }) => {
      setEdital(data);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  async function submter() {
    api.post(`projects/submit/${project.id}`, {
      edital_id: id,
      coordenador_id: user.id,
      submetido: "true",
    }).then(({ data }) => {
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

      setScreen({
        ...screen, header: true, documents: false, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
      });

      getProject();
    });
  }

  function soma(array) {
    return array.length > 0 ? array.reduce((accumulator, currentValue) => accumulator + getValue(currentValue.valor), 0).toFixed(2) : '0';
  }

  function price_to_number(v) {
    if (!v) { return 0; }
    v = v.split('.').join('');
    v = v.split(',').join('.');
    return Number(v.replace(/[^0-9.]/g, ""));
  }

  const handleSubmit = useCallback(
    async (data) => {
      if (coordenador != user.id || !edital?.valid || project?.submetido == 'true') {
        return null;
      }
      try {
        formRef.current.setErrors({});

        if (screen.header) {
          const schema = Yup.object().shape({
            title: configuration.plano_trabalho.fields.titulo_projeto.checked ? Yup.string().required('Campo obrigatório') : undefined,
            faixa_value: configuration.plano_trabalho.fields.faixa_valor.checked ? Yup.string().required('Campo obrigatório') : undefined,
            institution: configuration.plano_trabalho.fields.instituicao.checked ? Yup.string().required('Campo obrigatório') : undefined,
            beggin_prevision: configuration.plano_trabalho.fields.inicio_previsto.checked ? Yup.string().required('Campo obrigatório') : undefined,
            // money_foreign: configuration.plano_trabalho.fields.cotacao_moeda_estrangeira.checked ? Yup.string().required('Campo obrigatório') : undefined,
            theme: configuration.plano_trabalho.fields.tema_interesse.checked ? Yup.string().required('Campo obrigatório') : undefined,
          });

          if ((price_to_number(money_mask(String(soma(despesas)))) + price_to_number(money_mask(String(soma(recursos))))) > price_to_number(String(data.faixa_value).split('a')[1].trim())) {
            store.addNotification({
              message: `Despesas estão ultrapassando o valor total da faixa de valor selecionada (${data?.faixa_value || 'R$ 0,00 a R$0,00'}). Altere os valores dos orçamentos para continuar!`,
              type: 'danger',
              insert: 'top',
              container: 'top-right',
              animationIn: ['animate__animated', 'animate__fadeIn'],
              animationOut: ['animate__animated', 'animate__fadeOut'],
              dismiss: {
                duration: 8000,
                onScreen: true,
              },
            });

            setLoading(false);

            return null;
          }

          await schema.validate(data, {
            abortEarly: false,
          });

          setLoading(true);

          const formData = new FormData();
          formData.append('edital_id', id);
          formData.append('title', data.title || "");
          formData.append('protocolo', protocolo);
          formData.append('coordenador_id', user.id);
          formData.append('email', user.email);
          formData.append('faixa_value', data.faixa_value || "");
          formData.append('theme', data.theme || "");
          formData.append('institution', data.institution || "");
          formData.append('unity_execution', data.unity_execution || "");
          formData.append('beggin_prevision', data.beggin_prevision || "");
          formData.append('duration', data.duration || "");
          formData.append('money_foreign', configuration.plano_trabalho.fields.cotacao_moeda_estrangeira.value || "");

          api.post(`projects`, formData).then(({ data }) => {
            setLoading(false);

            getProject();
          }).catch((error) => {
            setLoading(false);
            store.addNotification({
              message: `Não foi possível salvar projeto!`,
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
        } if (screen.documents) {
          if (project) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < files.length; i++) {
              if (project.files.length == 0) {
                if (files[i].file.name && !files[i].file.url) {
                //
                } else if (project.files.length != files.length) {
                  store.addNotification({
                    message: `Preencha todos os documentos!`,
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

                  return null;
                }
              }
            }
          } else {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < files.length; i++) {
              if (files[i].file.name && !files[i].file.url) {
                //
              } else {
                store.addNotification({
                  message: `Preencha todos os documentos!`,
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

                return null;
              }
            }
          }

          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < files.length; i++) {
            if (!project) {
              if (files[i].file.name && !files[i].file.url) {
                const formData = new FormData();

                formData.append('project_id', project.id);
                formData.append('configuration_document_id', files[i].configuration_document_id);
                formData.append('edital_id', id);
                formData.append('coordenador_id', user.id);
                formData.append('file', files[i].file);

                setLoading(true);
                api.post(`projects/documents`, formData).then(({ data }) => {
                  // setFiles(files.map((file) => (file.id == data.configuration_document_id ? ({ ...file, file: { ...file.file, size: null }, url_attachment: data.url }) : file)));
                  setLoading(false);
                });
              }
            } else if (project.files.length == 0) {
              if (files[i].file.name && !files[i].file.url) {
                const formData = new FormData();

                formData.append('project_id', project.id);
                formData.append('configuration_document_id', files[i].configuration_document_id);
                formData.append('edital_id', id);
                formData.append('coordenador_id', user.id);
                formData.append('file', files[i].file);

                setLoading(true);

                // eslint-disable-next-line no-await-in-loop
                await api.post(`projects/documents`, formData);
                setLoading(false);
              }
            } else if (files[i].file.name && !files[i].file.url) {
              const formData = new FormData();
              formData.append('file', files[i].file);

              setLoading(true);

              // eslint-disable-next-line no-await-in-loop
              const { data } = await api.put(`projects/documents/${files[i].id}`, formData);
              setFiles(files.map((file) => (file.id == data.id ? ({ ...file, file: { ...file.file, size: null }, url_attachment: data.url }) : file)));
              setLoading(false);
            }
          }

          getProject();
        } else if (screen.appresentation) {
          setLoading(true);

          const formData = new FormData();
          formData.append('edital_id', id);
          formData.append('coordenador_id', user.id);
          formData.append('resumo', plano.resumo || '');
          formData.append('palavras_chave', plano.palavras_chave || '');
          formData.append('informacoes_relevantes_para_avaliacao', plano.informacoes_relevantes_para_avaliacao || '');
          formData.append('experiencia_coordenador', plano.experiencia_coordenador || '');
          formData.append('sintese_projeto', plano.sintese_projeto || '');
          formData.append('objetivos_gerais', plano.objetivos_gerais || '');
          formData.append('objetivos_especificos', plano.objetivos_especificos || '');
          formData.append('metodologia', plano.metodologia || '');
          formData.append('resultados_esperados', plano.resultados_esperados || '');
          formData.append('impactos_esperados', plano.impactos_esperados || '');
          formData.append('riscos_atividades', plano.riscos_atividades || '');
          formData.append('referencia_bibliografica', plano.referencia_bibliografica || '');
          formData.append('estado_arte', plano.estado_arte || '');

          api.post(`projects`, formData).then(({ data }) => {
            setLoading(false);

            getProject();
          }).catch((error) => {
            setLoading(false);
            store.addNotification({
              message: `Não foi possível salvar projeto!`,
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
        } else if (screen.abrangencia) {
          setLoading(true);

          const formData = new FormData();
          formData.append('edital_id', id);
          formData.append('coordenador_id', user.id);
          formData.append('abrangencia', JSON.stringify(abrangencias));

          api.post(`projects`, formData).then(({ data }) => {
            setLoading(false);

            getProject();
          }).catch((error) => {
            setLoading(false);
            store.addNotification({
              message: `Não foi possível salvar projeto!`,
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
        } else if (screen.recursos) {
          setLoading(true);

          const formData = new FormData();
          formData.append('edital_id', id);
          formData.append('coordenador_id', user.id);
          formData.append('recursos_proprios', JSON.stringify(despesas));
          formData.append('recursos_solicitados_outros', JSON.stringify(recursos));

          if ((price_to_number(money_mask(String(soma(despesas)))) + price_to_number(money_mask(String(soma(recursos))))) > price_to_number(String(project?.faixa_value || 'R$ 0,00 a R$0,00').split('a')[1].trim())) {
            store.addNotification({
              message: `Despesas estão ultrapassando o valor total da faixa de valor (${project?.faixa_value || 'R$ 0,00 a R$0,00'})!`,
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

            setLoading(false);

            return null;
          }

          api.post(`projects`, formData).then(({ data }) => {
            setLoading(false);

            getProject();
          }).catch((error) => {
            setLoading(false);
            store.addNotification({
              message: `Não foi possível salvar projeto!`,
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
        } else if (screen.equipe) {
          setLoading(true);

          // Bolsista (Bolsa Integral: R$ 400,00 a R$ 600,00)

          const aux = membros.filter((item) => String(`${JSON.parse(item.value).funcao}`) != 'Coordenador(a)');
          const result = aux.map((item) => price_to_number(String(`${JSON.parse(item.value).funcao}`).split(':')[1].trim().split('a')[1].trim()));

          const total = result.reduce((total, numero) => total + numero, 0);

          if ((total + price_to_number(money_mask(String(soma(despesas)))) + price_to_number(money_mask(String(soma(recursos))))) > price_to_number(String(project?.faixa_value || 'R$ 0,00 a R$0,00').split('a')[1].trim())) {
            store.addNotification({
              message: `Despesas estão ultrapassando o valor total da faixa de valor (${project?.faixa_value || 'R$ 0,00 a R$0,00'})!`,
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

            setLoading(false);

            return null;
          }

          // const filter = atividades.filter((atividade) => isUuid(String(atividade.id)));

          console.log(atividades);

          const formData = new FormData();
          formData.append('edital_id', id);
          formData.append('coordenador_id', user.id);
          formData.append('membros', membros.map((item) => String(`${JSON.parse(item.value).id} - ${JSON.parse(item.value).funcao || "Coordenador(a)"}`)).join("@"));
          formData.append('atividades', JSON.stringify(atividades.map((item) => ({
            ...item,
            participantes: item.participantes.map((participante) => (String(isUuid(String(item.id)) ? JSON.parse(participante.value).id : participante.id))).join(","),
            responsavel: String(item.responsavel.id),
          }))));

          api.post(`projects`, formData).then(({ data }) => {
            setLoading(false);

            getProject();
          }).catch((error) => {
            setLoading(false);
            store.addNotification({
              message: `Não foi possível salvar projeto!`,
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
        } else if (screen.orcamento) {
          setLoading(true);

          const formData = new FormData();
          formData.append('edital_id', id);
          formData.append('coordenador_id', user.id);
          formData.append('orcamento', JSON.stringify(orcamentos));

          // console.log(price_to_number(money_mask(String(soma(despesas)))));
          // console.log(price_to_number(String(project.faixa_value).split('a')[1].trim()));

          if (price_to_number(money_mask(String(soma(despesas)))) > price_to_number(String(project?.faixa_value || 'R$ 0,00 a R$0,00').split('a')[1].trim())) {
            store.addNotification({
              message: `Despesas estão ultrapassando o valor total da faixa de valor (${project?.faixa_value || 'R$ 0,00 a R$0,00'})!`,
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

            setLoading(false);

            return null;
          }

          api.post(`projects`, formData).then(({ data }) => {
            setLoading(false);

            getProject();
          }).catch((error) => {
            setLoading(false);
            store.addNotification({
              message: `Não foi possível salvar projeto!`,
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
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, screen, files, protocolo, user, plano, abrangencias, recursos, despesas, membros, atividades, configuration],
  );

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Submit"));

    setOpenConfirm(!OpenConfirm);
  }

  async function toggleModalHomologar() {
    ModalHomologar = await lazy(() => import("../../../components/Homologar"));

    setOpenHomologar(!OpenHomologar);
  }

  async function toggleModalContratar() {
    ModalContratar = await lazy(() => import("../../../components/Contratar"));

    setOpencontratar(!OpenContratar);
  }

  function submitModalConfirm() {
    submter();
    setOpenConfirm(!OpenConfirm);
  }

  function submitModalHomologar(homologado) {
    api.post(`evaluations`, {
      id: project.avaliacao.id,
      homologado,
    }).then(({ data }) => {
      store.addNotification({
        message: `Projeto atualizado com sucesso!`,
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

      setHomologacao(false);
      setOpenHomologar(!OpenHomologar);
      getProject();
    });
  }

  function submitModalContratar(contratado) {
    api.post(`evaluations`, {
      id: project.avaliacao.id,
      contratado,
    }).then(({ data }) => {
      store.addNotification({
        message: `Projeto atualizado com sucesso!`,
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

      setOpencontratar(!OpenContratar);
      getProject();
    });
  }

  function backPage() {
    if (screen.documents) {
      setPageLoading(true);
      setTimeout(() => {
        setScreen({
          ...screen, header: true, documents: false, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
        });
      }, 1000);
      setTimeout(() => {
        setPageLoading(false);
      }, 2000);
    }

    if (screen.appresentation) {
      if (configuration?.files?.length == 0) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: true, documents: false, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: true, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      }
    }

    if (screen.abrangencia) {
      if (JSON.parse(configuration.apresentacao).isOne) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: false, appresentation: true, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else if (configuration?.files?.length != 0) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: true, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: true, documents: false, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      }
    }

    if (screen.equipe) {
      if (JSON.parse(configuration.abrangencia).abrangencias.abrangencia.checked) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: false, appresentation: false, abrangencia: true, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else if (JSON.parse(configuration.apresentacao).isOne) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: false, appresentation: true, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else if (configuration?.files?.length != 0) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: true, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: true, documents: false, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      }
    }

    if (screen.orcamento) {
      if (JSON.parse(configuration.membros).equipes.equipe.checked) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: false, appresentation: false, abrangencia: false, equipe: true, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else if (JSON.parse(configuration.abrangencia).abrangencias.abrangencia.checked) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: false, appresentation: false, abrangencia: true, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else if (JSON.parse(configuration.apresentacao).isOne) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: false, appresentation: true, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else if (configuration?.files?.length != 0) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: true, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: true, documents: false, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      }
    }

    if (screen.recursos) {
      if (JSON.parse(configuration.orcamento).isOne) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: false, appresentation: false, abrangencia: false, equipe: false, orcamento: true, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else if (JSON.parse(configuration.orcamento).isOne) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: false, appresentation: false, abrangencia: false, equipe: true, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else if (JSON.parse(configuration.abrangencia).abrangencias.abrangencia.checked) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: false, appresentation: false, abrangencia: true, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else if (JSON.parse(configuration.apresentacao).isOne) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: false, appresentation: true, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else if (configuration?.files?.length != 0) {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: false, documents: true, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      } else {
        setPageLoading(true);
        setTimeout(() => {
          setScreen({
            ...screen, header: true, documents: false, appresentation: false, abrangencia: false, equipe: false, orcamento: false, recursos: false,
          });
        }, 1000);
        setTimeout(() => {
          setPageLoading(false);
        }, 2000);
      }
    }
  }

  function download(url, filename) {
    fetch(url).then((t) => t.blob().then((b) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.setAttribute("download", filename);
      a.click();
    }));
  }

  async function generatePDF() {
    store.addNotification({
      message: `Exportação do projeto iniciada. Aguarde um momento!`,
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

    api
      .post(`/projects/reports/${project.id}`)
      .then((response) => {
        // window.open(response.data.url, "_blank");
        download(
          response.data.url,
          String(response.data.url)
            .split("/")
            .pop(),
        );
      })
      .catch((error) => {
        store.addNotification({
          message: `Erro ao Baixar Projeto!`,
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
  }

  return (
    <>
      {avaliacao
        ? (
          <Avaliacao
            formRef={formRef}
            project={project}
            getProject={getProject}
            isOpen={OpenEvaluation}
            toggleModal={toggleModalEvaluation}
            submit={submitModalEvaluation}
            setAvaliacao={setAvaliacao}
          />
        ) : homologacao ? (
          <Homologacao
            isOpen={OpenHomologar}
            project={project}
            toggleModal={toggleModalHomologar}
            submit={submitModalHomologar}
            setHomologacao={setHomologacao}
          />
        ) : (
          <>
            <div className="col-12 title">
              <h1>
                {edital?.title && `Projeto para ${edital.title}`}
                {' '}
                {project && <FiDownloadCloud data-tip="Baixar Projeto" onClick={generatePDF} style={{ fontSize: 20, cursor: 'pointer' }} />}
              </h1>

              {project && <ReactTooltip />}
            </div>

            <div>

              {project
      && project?.submetido == 'false' && edital?.valid && (
      <Content>
        <button
          style={{
            marginBottom: 10, width: 180, marginLeft: 15, marginTop: 10,
          }}
          type="button"
          onClick={toggleModalConfirm}
        >
          Submeter projeto
        </button>
      </Content>
              )}

              {edital && !edital?.valid && project?.submetido == 'false' && (
              <Content>
                <div style={{
                  marginBottom: 10, marginLeft: 15, marginTop: 10,
                }}
                >
                  <label style={{ fontSize: 18, fontWeight: 'bold', color: '#8b0000' }}>{`Projeto não pode mais ser submetido pois o edital foi finalizado em: ${moment(edital?.end).format("LL")}.`}</label>
                </div>
              </Content>
              )}

              {project?.submetido == 'true'
      && (
      <Content>
        <div style={{
          marginBottom: 10, marginLeft: 15,
        }}
        >
          <label style={{ fontSize: 12, color: '#424242' }}>{`Projeto submetido com sucesso em: ${moment(project.updated_at).format("LLLL")}.`}</label>
        </div>
      </Content>
      )}

              {project && (coordenador == user.id) && project?.submetido == 'true' && (
              <Content>
                <div style={{
                  marginBottom: 10, marginLeft: 15, marginTop: 10,
                }}
                >
                  <label style={{ fontSize: 18, fontWeight: 'bold', color: '#080' }}>{`Situação atual: ${project.avaliacao.status}`}</label>
                </div>
              </Content>
              )}

              {project && (coordenador != user.id) && (project?.avaliacao?.status == 'Não Homologado' || project?.avaliacao?.status == 'Contratado' || project?.avaliacao?.status == 'Não Contratado') && (
              <Content>
                <div style={{
                  marginBottom: 10, marginLeft: 15, marginTop: 10,
                }}
                >
                  <label style={{ fontSize: 18, fontWeight: 'bold', color: '#080' }}>{`Situação atual: ${project.avaliacao.status}`}</label>
                </div>
              </Content>
              )}

              {project && (coordenador != user.id) && user.profile.name != 'Pesquisador' && !project?.avaliacao?.enquadrado && (
              <Content>
                <button
                  style={{
                    marginBottom: 10, width: 180, marginLeft: 15, marginTop: 10,
                  }}
                  type="button"
                  onClick={toggleModalForm}
                >
                  Enquadrar projeto
                </button>
              </Content>
              )}

              {project && (coordenador != user.id) && user.profile.name != 'Pesquisador' && project?.avaliacao?.status == 'Avaliação' && !project?.avaliacao?.responsavel_id && project?.avaliacao?.recomendado1 && (
              <Content>
                <button
                  style={{
                    marginBottom: 10, width: 200, height: 60, marginLeft: 15, marginTop: 10,
                  }}
                  type="button"
                  onClick={toggleModalForm}
                >
                  Delegar Avaliador Especialista
                </button>
              </Content>
              )}

              {project && (coordenador != user.id) && user.profile.name != 'Pesquisador' && (project?.avaliacao?.status == 'Não Homologado' || project?.avaliacao?.status == 'Homologação') && (
              <Content>
                <button
                  style={{
                    marginBottom: 10, width: 200, marginLeft: 15, marginTop: 10,
                  }}
                  type="button"
                  onClick={() => setHomologacao(true)}
                >
                  Homologar projeto
                </button>
              </Content>
              )}

              {project && (coordenador != user.id) && user.profile.name != 'Pesquisador' && (project?.avaliacao?.status == 'Homologado' || project?.avaliacao?.status == 'Não Contratado') && (
              <Content>
                <button
                  style={{
                    marginBottom: 10, width: 200, marginLeft: 15, marginTop: 10,
                  }}
                  type="button"
                  onClick={toggleModalContratar}
                >
                  Contratar projeto
                </button>
              </Content>
              )}

              {project && (project?.avaliacao.responsavel_id == user.id) && (
              <Content>
                <button
                  style={{
                    marginBottom: 10, width: 180, marginLeft: 15, marginTop: 10,
                  }}
                  type="button"
                  onClick={() => setAvaliacao(true)}
                >
                  Avaliar projeto
                </button>
              </Content>
              )}
            </div>

            <div className="col-12 px-0">
              <Card className="red">
                <div className="card-body">
                  <Breadcumb project={project} screen={screen} setScreen={setScreen} setPageLoading={setPageLoading} />

                  {!initiaLoading
            && (
            <Unform initialData={project} ref={formRef} onSubmit={handleSubmit}>
              <Content>
                {screen.header && !pageLoading && <Header invalid={coordenador != user.id || !edital?.valid || project?.submetido == 'true'} files={files} setFiles={setFiles} protocolo={protocolo} edital={edital} formRef={formRef} />}
                {screen.documents && !pageLoading && <Document invalid={coordenador != user.id || !edital?.valid || project?.submetido == 'true'} files={files} setFiles={setFiles} protocolo={protocolo} edital={edital} formRef={formRef} />}
                {screen.appresentation && !pageLoading && <Appresentation />}
                {screen.abrangencia && !pageLoading && <Abrangencia />}
                {screen.equipe && !pageLoading && <Equipe />}
                {screen.orcamento && !pageLoading && <Orcamento formRef={formRef} orcamentos={orcamentos} setOrcamentos={setOrcamentos} despesas={despesas} setDespesas={setDespesas} />}
                {screen.recursos && !pageLoading && <Recursos />}
              </Content>

              {coordenador == user.id
              && (
              <div style={{ marginTop: 20 }} className="modal-footer">
                {loading ? (<ReactLoading type="spin" height="50px" width="50px" color="#3699ff" />) : project?.submetido == 'false' && (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {!screen.header && !pageLoading
                  && (
                  <Button
                    className="primary"
                    style={{ marginRight: 10 }}
                    type="button"
                    onClick={backPage}
                  >
                    Voltar
                  </Button>
                  )}
                  <Button
                    className="primary"
                  >
                    Salvar
                  </Button>
                </div>
                )}

                {!project && !loading && (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {!screen.header && !pageLoading
                  && (
                  <Button
                    className="primary"
                    style={{ marginRight: 10 }}
                    type="button"
                    onClick={backPage}
                  >
                    Voltar
                  </Button>
                  )}

                  <Button
                    className="primary"
                  >
                    Salvar
                  </Button>
                </div>
                )}
              </div>
              )}
            </Unform>
            )}
                </div>
              </Card>
            </div>

            <Suspense fallback={null}>
              <ModalProvider>
                <ModalConfirm isOpen={OpenConfirm} toggleModal={toggleModalConfirm} submit={submitModalConfirm} />
                <ModalHomologar isOpen={OpenHomologar} project={project} toggleModal={toggleModalHomologar} submit={submitModalHomologar} />
                <ModalContratar isOpen={OpenContratar} toggleModal={toggleModalContratar} submit={submitModalContratar} />
                <ModalForm
                  project={project}
                  getProject={getProject}
                  isOpen={OpenForm}
                  toggleModal={toggleModalForm}
                  submit={submitModalForm}
                />
                <ModalEvaluation
                  formRef={formRef}
                  project={project}
                  getProject={getProject}
                  isOpen={OpenEvaluation}
                  toggleModal={toggleModalEvaluation}
                  submit={submitModalEvaluation}
                />
              </ModalProvider>
            </Suspense>
          </>
        )}
    </>
  );
}
