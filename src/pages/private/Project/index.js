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

  const [screen, setScreen] = useState({
    header: true,
    appresentation: false,
    abrangencia: false,
    recursos: false,
    equipe: false,
  });

  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const [membros, setMembros] = useState([{ label: user.name, value: JSON.stringify(user) }]);
  const [atividades, setAtividades] = useState([]);

  const [files, setFiles] = useState([]);
  const [edital, setEdital] = useState({ title: '' });
  const protocolo = uuid();
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

    api.get(`/programs/files/edital/${id}`).then(({ data }) => {
      setEdital(data);
    });
  }, [id]);

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
            email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
            faixa_value: Yup.string().required('Campo obrigatório'),
            institution: Yup.string().required('Campo obrigatório'),
            unity_execution: Yup.string().required('Campo obrigatório'),
            beggin: Yup.string().required('Campo obrigatório'),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          setLoading(true);

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
        } else if (screen.appresentation) {
          console.log(plano);
        } else if (screen.abrangencia) {
          console.log(abrangencias);
        } else if (screen.recursos) {
          console.log(despesas);
          console.log(recursos);
        } else if (screen.equipe) {
          console.log(membros);
          console.log(atividades);
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [screen, edital, files, protocolo, user, plano, abrangencias, recursos, despesas, membros, atividades],
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
              <Breadcumb screen={screen} setScreen={setScreen} />

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
          </div>
        </Card>
      </div>
    </>
  );
}
