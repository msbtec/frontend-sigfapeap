import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';

import * as Yup from 'yup';

import ReactLoading from "react-loading";

import { useParams } from 'react-router-dom';

import { Form as Unform } from '@unform/web';
import { store } from 'react-notifications-component';
import { Button } from '../../../components/Button';

import { Content } from './styles';

import { useAuth } from '../../../hooks/auth';

import { Card } from '../../../components/Card';

import Header from './Header';
import Appresentation from './Appresentation';
import Abrangencia from './Abrangencia';
import Recursos from './Recursos';
import Equipe from './Equipe';

import getValidationErrors from '../../../utils/getValidationErrors';

import api from '../../../services/api';

export default function Project() {
  const formRef = useRef(null);

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

  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const [membros, setMembros] = useState([{ label: user.name, value: JSON.stringify(user) }]);
  const [atividades, setAtividades] = useState([]);

  const [edital, setEdital] = useState(null);
  const { id } = useParams();

  const [files, setFiles] = useState([]);

  const [screen, setScreen] = useState({
    header: true,
    appresentation: false,
    abrangencia: false,
    recursos: false,
    equipe: false,
  });

  const [knowledgesArea, setKnowledgesArea] = useState({
    one: '',
    two: '',
  });

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
        }

        setLoading(true);

        setTimeout(() => {
          setLoading(false);
        }, 2000);

        // api.put(`route`, {}).then(({ data }) => {
        //   setLoading(false);

        //   store.addNotification({
        //     message: `Projeto submetido com sucesso!`,
        //     type: 'success',
        //     insert: 'top',
        //     container: 'top-right',
        //     animationIn: ['animate__animated', 'animate__fadeIn'],
        //     animationOut: ['animate__animated', 'animate__fadeOut'],
        //     dismiss: {
        //       duration: 5000,
        //       onScreen: true,
        //     },
        //   });
        // }).finally(() => {});
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
                  <a onClick={() => setScreen({
                    ...screen, header: true, appresentation: false, abrangencia: false, equipe: false, recursos: false,
                  })}
                  >
                    Plano de Trabalho
                  </a>
                </li>
                <li style={{
                  backgroundColor: screen.appresentation ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
                }}
                >
                  <a onClick={() => setScreen({
                    ...screen, header: false, abrangencia: false, recursos: false, equipe: false, appresentation: true,
                  })}
                  >
                    Plano de apresentação
                  </a>
                </li>
                <li style={{
                  backgroundColor: screen.abrangencia ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
                }}
                >
                  <a onClick={() => setScreen({
                    ...screen, header: false, appresentation: false, abrangencia: true, equipe: false, recursos: false,
                  })}
                  >
                    Abrangência
                  </a>
                </li>
                <li style={{
                  backgroundColor: screen.recursos ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
                }}
                >
                  <a onClick={() => setScreen({
                    ...screen, header: false, appresentation: false, abrangencia: false, equipe: false, recursos: true,
                  })}
                  >
                    Recursos
                  </a>
                </li>
                <li style={{
                  backgroundColor: screen.equipe ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
                }}
                >
                  <a onClick={() => setScreen({
                    ...screen, header: false, appresentation: false, abrangencia: false, equipe: true, recursos: false,
                  })}
                  >
                    Equipe
                  </a>
                </li>
              </ul>

              <Content>
                {screen.header && <Header files={files} setFiles={setFiles} edital={edital} user={user} formRef={formRef} knowledgesArea={knowledgesArea} setKnowledgesArea={setKnowledgesArea} />}
                {screen.appresentation && <Appresentation plano={plano} setPlano={setPlano} formRef={formRef} />}
                {screen.abrangencia && <Abrangencia formRef={formRef} abrangencias={abrangencias} setAbrangencias={setAbrangencias} />}
                {screen.recursos && <Recursos formRef={formRef} despesas={despesas} setDespesas={setDespesas} recursos={recursos} setRecursos={setRecursos} />}
                {screen.equipe && <Equipe formRef={formRef} membros={membros} setMembros={setMembros} atividades={atividades} setAtividades={setAtividades} />}
              </Content>

              {/* {screen.recursos
              && (
              <div className="modal-footer">
                {loading ? (<ReactLoading type="spin" height="5%" width="5%" color="#3699ff" />) : (
                  <Button
                    className="primary"
                  >
                    Salvar
                  </Button>
                )}
              </div>
              )} */}
            </Unform>
          </div>
        </Card>
      </div>
    </>
  );
}
