import React, {
  useEffect, useState, useRef, useCallback, Suspense, lazy,
} from 'react';

import * as Yup from 'yup';

import ReactLoading from "react-loading";

import LoadingOverlay from 'react-loading-overlay';

import { ModalProvider } from 'styled-react-modal';

import moment from 'moment';

import { useParams } from 'react-router-dom';

import { Form as Unform } from '@unform/web';
import { store } from 'react-notifications-component';
import uuid from 'react-uuid';
import {
  moeda,
} from '../../../utils/validations';
import {
  soma,
} from '../../../utils/soma';
import { Button } from '../../../components/Button';

import { Content } from './styles';

import { useAuth } from '../../../hooks/auth';
import { useProject } from '../../../hooks/project';

import { Card } from '../../../components/Card';

import Header from './Tabs/Header';
import Appresentation from './Tabs/Appresentation';
import Abrangencia from './Tabs/Abrangencia';
import Recursos from './Tabs/Recursos';
import Equipe from './Tabs/Equipe';
import Orcamento from './Tabs/Orcamento';

import Breadcumb from './Components/Breadcumb';

import getValidationErrors from '../../../utils/getValidationErrors';

import api from '../../../services/api';

let ModalConfirm = () => <></>;
let ModalForm = () => <></>;

export default function Project() {
  const formRef = useRef(null);

  const { user } = useAuth();

  const [OpenConfirm, setOpenConfirm] = useState(false);

  const {
    project, setProject, membros, setMembros, atividades, setAtividades,
    plano, setPlano, despesas, setDespesas, recursos,
    setRecursos, abrangencias, setAbrangencias,
    orcamentos, setOrcamentos, setLoading : setPageLoading,
    configuration, setConfigurations
  } = useProject();

  const [screen, setScreen] = useState({
    header: true,
    appresentation: false,
    abrangencia: false,
    recursos: false,
    equipe: false,
    orcamento: false,
  });

  const [initiaLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState([]);
  const [edital, setEdital] = useState({ title: '' });
  const [protocolo, setProtocolo] = useState(uuid());
  const { id, coordenador } = useParams();

  const [OpenForm, setOpenForm] = useState(false);

  async function toggleModalForm() {
    ModalForm = await lazy(() => import("./Modal"));

    setOpenForm(!OpenForm);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
  }

  async function getProject() {
    setPageLoading(true);

    setProject(null);
    setMembros([{ label: user.name, value: JSON.stringify(user) }]);
    setAtividades([]);
    setPlano({
      resumo: '',
      palavras_chave: '',
      informacoes_relevantes_para_avaliacao: '',
      experiencia_coordenador: '',
      sintese_projeto: '',
      objetivos_gerais: '',
      objetivos_especificos: '',
      metodologia: '',
      resultados_esperados: '',
      impactos_esperados: '',
      riscos_atividades: '',
      referencia_bibliografica: '',
      estado_arte: '',
    });
    setDespesas([
      {
        id: uuid(),
        titulo: "Diárias",
        valor: "R$ 0",
      },
      {
        id: uuid(),
        titulo: "Hospedagem/Alimentação",
        valor: "R$ 0",
      },
      {
        id: uuid(),
        titulo: "Material de Consumo",
        valor: "R$ 0",
      },
      {
        id: uuid(),
        titulo: "Passagens",
        valor: "R$ 0",
      },
      {
        id: uuid(),
        titulo: "Pessoal",
        valor: "R$ 0",
      },
      {
        id: uuid(),
        titulo: "Encargos",
        valor: "R$ 0",
      },
      {
        id: uuid(),
        titulo: "Bolsas",
        valor: "R$ 0",
      },
      {
        id: uuid(),
        titulo: "Outros Serviços de Terceiros",
        valor: "R$ 0",
      },
      {
        id: uuid(),
        titulo: "Equipamentos e Material Permanente",
        valor: "R$ 0",
      },
    ]);
    setRecursos([]);
    setAbrangencias([]);
    setOrcamentos(
      {
        diarias: [],
        hospedagem_alimentacao: [],
        materiais_consumo: [],
        passagens: [],
        servicos_terceiros: [],
        materiais_permanentes_equipamentos: [],
        pessoal: [],
        bolsas: [],
        encargos: [],
      },
    );

    setInitialLoading(true);
    api.put(`/projects`, {
      edital_id: id,
      coordenador_id: coordenador,
    }).then(({ data }) => {
      setProject(data);
      setFiles(data.files.map((item) => ({
        id: item.id,
        title: item.title,
        file: item,
      })));
      setProtocolo(data.protocolo || uuid());
      setAbrangencias(JSON.parse(data.abrangencia || '[]'));

      const orcamentos_temp = JSON.parse(data.orcamento || JSON.stringify(orcamentos));
      setOrcamentos(orcamentos_temp);

      const despesas_temp = JSON.parse(data.recursos_proprios || JSON.stringify(despesas));
      setDespesas(despesas_temp.map((item) => (
        (item.titulo == 'Diárias') ? ({ ...item, valor: moeda(String(soma(orcamentos_temp.diarias))) })
          : (item.titulo == 'Hospedagem/Alimentação') ? ({ ...item, valor: moeda(String(soma(orcamentos_temp.hospedagem_alimentacao))) })
            : (item.titulo == 'Material de Consumo') ? ({ ...item, valor: moeda(String(soma(orcamentos_temp.materiais_consumo))) })
              : (item.titulo == 'Passagens') ? ({ ...item, valor: moeda(String(soma(orcamentos_temp.passagens))) })
                : (item.titulo == 'Outros Serviços de Terceiros') ? ({ ...item, valor: moeda(String(soma(orcamentos_temp.servicos_terceiros))) })
                  : (item.titulo == 'Equipamentos e Material Permanente') ? ({ ...item, valor: moeda(String(soma(orcamentos_temp.materiais_permanentes_equipamentos))) })
                    : (item.titulo == 'Pessoal') ? ({ ...item, valor: moeda(String(soma(orcamentos_temp.pessoal))) })
                      : (item.titulo == 'Bolsas') ? ({ ...item, valor: moeda(String(soma(orcamentos_temp.bolsas))) })
                        : (item.titulo == 'Encargos') ? ({ ...item, valor: moeda(String(soma(orcamentos_temp.encargos))) })
                          : item
      )));

      setRecursos(JSON.parse(data.recursos_solicitados_outros || '[]'));
      if (data.membros.length > 0) {
        setMembros(data.membros.map((item) => ({ label: item.name, value: JSON.stringify(item) })));
      }
      setAtividades(JSON.parse(data.atividades || '[]'));

      setPlano({
        resumo: data.resumo || '',
        palavras_chave: data.palavras_chave || '',
        informacoes_relevantes_para_avaliacao: data.informacoes_relevantes_para_avaliacao || '',
        experiencia_coordenador: data.experiencia_coordenador || '',
        sintese_projeto: data.sintese_projeto || '',
        objetivos_gerais: data.objetivos_gerais || '',
        objetivos_especificos: data.objetivos_especificos || '',
        metodologia: data.metodologia || '',
        resultados_esperados: data.resultados_esperados || '',
        impactos_esperados: data.impactos_esperados || '',
        riscos_atividades: data.riscos_atividades || '',
        referencia_bibliografica: data.referencia_bibliografica || '',
        estado_arte: data.estado_arte || '',
      });

      api.get(`configurations`,{
          params: {
              edital_id: id
          }
      }).then(({ data }) => {
        setConfigurations({...data, plano_trabalho: JSON.parse(data.plano_trabalho)})
        setPageLoading(false);  setInitialLoading(false);
      });
    }).catch((error) => {
        api.get(`configurations`,{
            params: {
                edital_id: id
            }
        }).then(({ data }) => {
            setConfigurations({...data, plano_trabalho: JSON.parse(data.plano_trabalho)})
            setPageLoading(false);  setInitialLoading(false);
        });
    });
  }

  useEffect(() => {
    document.title = 'SIGFAPEAP - Submeter Projeto';

    setPageLoading(true)

    getProject();

    api.get(`/programs/files/edital/${id}`).then(({ data }) => {
      setEdital(data);
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const handleSubmit = useCallback(
    async (data) => {
        if(coordenador != user.id || !edital?.valid || project?.submetido == 'true'){
            return null;
        }
      try {
        formRef.current.setErrors({});

        if (screen.header) {
          const schema = Yup.object().shape({
            title: configuration.plano_trabalho.fields.titulo_projeto.checked ? Yup.string().required('Campo obrigatório') : undefined,
            faixa_value: configuration.plano_trabalho.fields.faixa_valor.checked ? Yup.string().required('Campo obrigatório') : undefined,
            institution: configuration.plano_trabalho.fields.instituicao.checked ? Yup.string().required('Campo obrigatório') : undefined,
            unity_execution: configuration.plano_trabalho.fields.unidade_executora.checked ? Yup.string().required('Campo obrigatório') : undefined,
            beggin_prevision: configuration.plano_trabalho.fields.inicio_previsto.checked ? Yup.string().required('Campo obrigatório') : undefined,
            money_foreign: configuration.plano_trabalho.fields.cotacao_moeda_estrangeira.checked ? Yup.string().required('Campo obrigatório') : undefined,
            theme: configuration.plano_trabalho.fields.tema_interesse.checked ? Yup.string().required('Campo obrigatório') : undefined,
        });

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
          formData.append('money_foreign', data.money_foreign || "");

          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < files.length; i++) {
            if (files[i].file.name && !files[i].file.url) {
              formData.append(`file`, files[i].file);
            }
          }

          api.post(`projects`, formData).then(({ data }) => {
            setLoading(false);

            store.addNotification({
              message: `Projeto salvo com sucesso!`,
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

            store.addNotification({
              message: `Projeto salvo com sucesso!`,
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

            store.addNotification({
              message: `Projeto salvo com sucesso!`,
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

          api.post(`projects`, formData).then(({ data }) => {
            setLoading(false);

            store.addNotification({
              message: `Projeto salvo com sucesso!`,
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

          const formData = new FormData();
          formData.append('edital_id', id);
          formData.append('coordenador_id', user.id);
          formData.append('membros', membros.map((item) => String(JSON.parse(item.value).id)));
          formData.append('atividades', JSON.stringify(atividades));

          api.post(`projects`, formData).then(({ data }) => {
            setLoading(false);

            store.addNotification({
              message: `Projeto salvo com sucesso!`,
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

          api.post(`projects`, formData).then(({ data }) => {
            setLoading(false);

            store.addNotification({
              message: `Projeto salvo com sucesso!`,
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
          console.log(error)
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

  function submitModalConfirm() {
    submter();
    setOpenConfirm(!OpenConfirm);
  }

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

        getProject();
    });
  }

  return (
    <>
      <div className="col-12 title">
        <h1>Submeter projeto</h1>
      </div>

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
          marginBottom: 10, marginLeft: 15, marginTop: 10,
        }}
        >
          <label style={{ fontSize: 18, fontWeight: 'bold', color: '#080' }}>{`Projeto submetido com sucesso em: ${moment(project.updated_at).format("LLLL")}.`}</label>
        </div>
      </Content>
      )}

      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-body">
            <Breadcumb screen={screen} setScreen={setScreen} setPageLoading={setPageLoading} />

            {!initiaLoading
            && (
            <Unform initialData={project} ref={formRef} onSubmit={handleSubmit}>
              <Content>
                {screen.header && <Header invalid={coordenador != user.id || !edital?.valid || project?.submetido == 'true'} files={files} setFiles={setFiles} protocolo={protocolo} edital={edital} formRef={formRef} />}
                {screen.appresentation && <Appresentation />}
                {screen.abrangencia && <Abrangencia />}
                {screen.equipe && <Equipe />}
                {screen.orcamento && <Orcamento formRef={formRef} orcamentos={orcamentos} setOrcamentos={setOrcamentos} despesas={despesas} setDespesas={setDespesas} />}
                {screen.recursos && <Recursos />}
              </Content>

            {coordenador == user.id &&
              <div style={{ marginTop: 20 }} className="modal-footer">
                {loading ? (<ReactLoading type="spin" height="50px" width="50px" color="#3699ff" />) : project?.submetido == 'false' && (
                  <Button
                    className="primary"
                  >
                    Salvar
                  </Button>
                )}

                {!project && !loading && (
                  <Button
                    className="primary"
                  >
                    Salvar
                  </Button>
                )}
              </div>
            }
            </Unform>
            )}
          </div>
        </Card>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <ModalConfirm isOpen={OpenConfirm} toggleModal={toggleModalConfirm} submit={submitModalConfirm} />

          <ModalForm
            project={project}
            atividades={atividades}
            setAtividades={setAtividades}
            membros={membros}
            setMembros={setMembros}
            isOpen={OpenForm}
            toggleModal={toggleModalForm}
            submit={submitModalForm}
          />
        </ModalProvider>
      </Suspense>
    </>
  );
}
