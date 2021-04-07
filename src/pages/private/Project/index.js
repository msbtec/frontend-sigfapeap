import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';

import * as Yup from 'yup';

import ReactLoading from "react-loading";

import { useParams } from 'react-router-dom';

import { Form as Unform } from '@unform/web';
import { store } from 'react-notifications-component';
import uuid from 'react-uuid';
import { Button } from '../../../components/Button';

import { Content } from './styles';

import { useAuth } from '../../../hooks/auth';

import { Card } from '../../../components/Card';

import Header from './Tabs/Header';
import Appresentation from './Tabs/Appresentation';
import Abrangencia from './Tabs/Abrangencia';
import Recursos from './Tabs/Recursos';
import Equipe from './Tabs/Equipe';

import Breadcumb from './Components/Breadcumb';

import getValidationErrors from '../../../utils/getValidationErrors';

import api from '../../../services/api';

export default function Project() {
  const formRef = useRef(null);

  const [project, setProject] = useState(null);

  const [screen, setScreen] = useState({
    header: true,
    appresentation: false,
    abrangencia: false,
    recursos: false,
    equipe: false,
  });

  const [initiaLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const [membros, setMembros] = useState([{ label: user.name, value: JSON.stringify(user) }]);
  const [atividades, setAtividades] = useState([]);

  const [files, setFiles] = useState([]);
  const [edital, setEdital] = useState({ title: '' });
  const [protocolo, setProtocolo] = useState(uuid());
  const { id } = useParams();

  const [plano, setPlano] = useState({
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

  const [despesas, setDespesas] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [abrangencias, setAbrangencias] = useState([]);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Submeter Projeto';

    setInitialLoading(true);
    api.put(`/projects`, {
      edital_id: id,
      coordenador_id: user.id,
    }).then(({ data }) => {
      setProject(data);
      setFiles(data.files.map((item) => ({
        id: item.id,
        title: item.title,
        file: item,
      })));
      setProtocolo(data.protocolo || uuid());
      setAbrangencias(JSON.parse(data.abrangencia || '[]'));
      setDespesas(JSON.parse(data.recursos_proprios || '[]'));
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

      setInitialLoading(false);
    }).catch((error) => { setInitialLoading(false); });

    api.get(`/programs/files/edital/${id}`).then(({ data }) => {
      setEdital(data);
    });
  }, [id, user]);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        if (screen.header) {
          console.log({
            ...data, protocolo, edital_id: edital.id, coordenador_id: user.id, files: files.filter((item) => item.file.name != null),
          });

          const schema = Yup.object().shape({
            title: Yup.string().required('Campo obrigatório'),
            // email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
            faixa_value: Yup.string().required('Campo obrigatório'),
            institution: Yup.string().required('Campo obrigatório'),
            unity_execution: Yup.string().required('Campo obrigatório'),
            beggin_prevision: Yup.string().required('Campo obrigatório'),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          setLoading(true);

          const formData = new FormData();
          formData.append('edital_id', id);
          formData.append('title', data.title);
          formData.append('protocolo', protocolo);
          formData.append('coordenador_id', user.id);
          formData.append('email', user.email);
          formData.append('faixa_value', data.faixa_value);
          formData.append('theme', data.theme);
          formData.append('institution', data.institution);
          formData.append('unity_execution', data.unity_execution);
          formData.append('beggin_prevision', data.beggin_prevision);
          formData.append('duration', data.duration);
          formData.append('money_foreign', data.money_foreign);

          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < files.length; i++) {
            if (files[i].file.name && !files[i].file.url) {
              formData.append(`file`, files[i].file);
            }
          }

          api.post(`projects`, formData).then(({ data }) => {
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
          }).catch((error) => {
            setLoading(false);
            store.addNotification({
              message: `Não foi possível submeter projeto!`,
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
          }).catch((error) => {
            setLoading(false);
            store.addNotification({
              message: `Não foi possível submeter projeto!`,
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
          }).catch((error) => {
            setLoading(false);
            store.addNotification({
              message: `Não foi possível submeter projeto!`,
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
          }).catch((error) => {
            setLoading(false);
            store.addNotification({
              message: `Não foi possível submeter projeto!`,
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
          }).catch((error) => {
            setLoading(false);
            store.addNotification({
              message: `Não foi possível submeter projeto!`,
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
    [id, screen, edital, files, protocolo, user, plano, abrangencias, recursos, despesas, membros, atividades],
  );

  return (
    <>
      <div className="col-12 title">
        <h1>Submeter projeto</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-body">
            <Breadcumb screen={screen} setScreen={setScreen} />

            {!initiaLoading
            && (
            <Unform initialData={project} ref={formRef} onSubmit={handleSubmit}>
              <Content>
                {screen.header && <Header files={files} setFiles={setFiles} protocolo={protocolo} edital={edital} user={user} formRef={formRef} />}
                {screen.appresentation && <Appresentation plano={plano} setPlano={setPlano} formRef={formRef} />}
                {screen.abrangencia && <Abrangencia formRef={formRef} abrangencias={abrangencias} setAbrangencias={setAbrangencias} />}
                {screen.recursos && <Recursos formRef={formRef} despesas={despesas} setDespesas={setDespesas} recursos={recursos} setRecursos={setRecursos} />}
                {screen.equipe && <Equipe formRef={formRef} membros={membros} setMembros={setMembros} atividades={atividades} setAtividades={setAtividades} />}
              </Content>

              <div style={{ marginTop: 20 }} className="modal-footer">
                {loading ? (<ReactLoading type="spin" height="50px" width="50px" color="#3699ff" />) : (
                  <Button
                    className="primary"
                  >
                    Salvar
                  </Button>
                )}
              </div>
            </Unform>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
