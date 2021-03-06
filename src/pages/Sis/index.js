import React, { useState, Suspense, lazy } from 'react';
import { Switch, Link } from 'react-router-dom';

import { store } from 'react-notifications-component';

import LoadingOverlay from 'react-loading-overlay';
import { FiMenu } from 'react-icons/fi';
import moment from 'moment';
import socket from '../../services/socket';

import Route from "../../routes/Route";

import { useAuth } from '../../hooks/auth';
import { useProject } from '../../hooks/project';
import { useProgram } from '../../hooks/program';
import { useContact } from '../../hooks/contact';
import { useEvaluator } from '../../hooks/evaluators';
import { useAttendance } from '../../hooks/attendance';
import { useRequest } from '../../hooks/request';

import Sidebar from './Sidebar';
import { Wrap, Main, NavBar } from './styles';

const Dashboard = lazy(() => import('./Dashboard'));
const MyProfile = lazy(() => import('../private/MyProfile'));
const Server = lazy(() => import('../private/Server'));
const Office = lazy(() => import('../private/Office'));
const Profile = lazy(() => import('../private/Profile'));
const SearchArea = lazy(() => import('../private/SearchArea'));
const ConnectSearchArea = lazy(() => import('../private/ConnectSearchArea'));
const Foundation = lazy(() => import('../private/Foundation'));
const Program = lazy(() => import('../private/Program'));
const ProjetosSubmetidos = lazy(() => import('../private/ProjetosSubmetidos'));
const Project = lazy(() => import('../private/Project'));
const EvaluatorsProgram = lazy(() => import('../private/EvaluatorsProgram'));
const ConfigurationNotice = lazy(() => import('../private/ConfigurationNotice'));
const Notice = lazy(() => import('../private/Notice'));
const Evaluator = lazy(() => import('../private/Evaluator'));
const Researcher = lazy(() => import('../private/Researcher'));
const Documentos = lazy(() => import('../private/Documentos'));
const Arquivos = lazy(() => import('../private/Arquivos'));
const Publicacoes = lazy(() => import('../private/Publicacoes'));
const ProjetosAvaliacao = lazy(() => import('../private/ProjetosAvaliacao'));
const Atividades = lazy(() => import('../private/Atividades'));
const Tarefas = lazy(() => import('../private/Tarefas'));
const Contato = lazy(() => import('../private/Contato'));
const Submetidos = lazy(() => import('../private/Submetidos'));
const EnviarSolicitacao = lazy(() => import('../private/EnviarSolicitacao'));
const AvaliacaoSolicitacao = lazy(() => import('../private/AvaliacaoSolicitacao'));
const Atendimento = lazy(() => import('../private/Atendimento'));

export default function Sis() {
  const { user } = useAuth();

  const { changeStatus } = useProgram();

  const { changeStatus: changeStatusRequest } = useContact();

  const { changeStatus: changeStatusAttendance } = useAttendance();

  const { loading, changeStatus: changeStatusProject } = useProject();

  const { changeStatus: changeStatusEvaluation } = useEvaluator();

  const { changeStatus: changeStatusRequests } = useRequest();

  const [data, setData] = useState(null);
  const [newRequest, setNewRequest] = useState(null);
  const [newRequests, setNewRequests] = useState(null);
  const [newAttendance, setNewAttendance] = useState(null);
  const [newProject, setNewProject] = useState(null);
  const [newEvaluation, setNewEvaluation] = useState(null);

  React.useEffect(() => {
    socket.connect();

    if (user.profile.name == 'Pesquisador') {
      socket.subscribeToChannel('notice', 'update-notice', (data) => {
        setData(data);
        store.addNotification({
          message: `Houve uma atualização na Chamada Pública: ${data.title}`,
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

      socket.subscribeToChannel('contact', 'response-contact', (data) => {
        setNewRequest(data);
        if (moment(data.created_at).isBefore(data.updated_at)) {
          if (user.id == data.user_id) {
            store.addNotification({
              message: `Solicitação Respondida!`,
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
        }
      });

      socket.subscribeToChannel('attendance', 'response-attendance', (data) => {
        setNewAttendance(data);
        if (moment(data.created_at).isBefore(data.updated_at)) {
          if (user.id == data.user_id) {
            store.addNotification({
              message: `Solicitação Respondida!`,
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
        }
      });

      socket.subscribeToChannel('request', 'new-request', (data) => {
        setNewRequests(data);
      });
    }

    if (user.profile.name == 'Administrador') {
      socket.subscribeToChannel('contact', 'new-contact', (data) => {
        setNewRequest(data);
        store.addNotification({
          message: `Nova Solicitação Recebida!`,
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

      socket.subscribeToChannel('attendance', 'new-attendance', (data) => {
        setNewAttendance(data);
        store.addNotification({
          message: `Nova Solicitação Recebida!`,
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

      socket.subscribeToChannel('request', 'response-request', (data) => {
        setNewRequests(data);
      });
    }

    // socket.subscribeToChannel('project', 'new-project', (data) => {
    //   setNewProject(data);
    // });

    socket.subscribeToChannel('project', 'update-project', (data) => {
      setNewProject(data);
    });

    // socket.subscribeToChannel('evaluation', 'new-evaluation', (data) => {
    //   setNewEvaluation(data);
    // });

    socket.subscribeToChannel('evaluation', 'update-evaluation', (data) => {
      setNewEvaluation(data);
      setNewProject(data);
    });
  }, [user]);

  React.useEffect(() => {
    changeStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  React.useEffect(() => {
    changeStatusRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRequest]);

  React.useEffect(() => {
    changeStatusRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRequests]);

  React.useEffect(() => {
    changeStatusAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAttendance]);

  React.useEffect(() => {
    changeStatusProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newProject]);

  React.useEffect(() => {
    changeStatusEvaluation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newEvaluation]);

  const [drag, setDrag] = useState(false);
  return (
    <LoadingOverlay
      active={loading}
      spinner
      text="Carregando..."
    >
      <Wrap>
        <Sidebar drag={drag} />
        <Main>
          <NavBar>
            <FiMenu className="toggle" style={{ marginLeft: drag ? 170 : 0 }} onClick={(e) => (drag ? setDrag(false) : setDrag(true))} />
            <Link to="/perfil">
              <span>
                Olá,
                {' '}
                <span className="name">{user.name}</span>
              </span>
            </Link>
          </NavBar>
          <div className="content">
            <div className="row">
              <Suspense fallback={(
                <div style={{
                  height: '100vh', width: '100%', display: 'flex', justifyContent: 'center',
                }}
                >
                  <div className="loader" />
                </div>
                )}
              >
                <Switch>
                  <Route exact path="/" component={Dashboard} />
                  <Route exact path="/perfil" component={MyProfile} />
                  <Route exact path="/usuarios" component={Server} />
                  <Route exact path="/cargos" component={Office} />
                  <Route exact path="/perfis" component={Profile} />
                  <Route exact path="/areas" component={SearchArea} />
                  <Route exact path="/vinculos" component={ConnectSearchArea} />
                  <Route exact path="/instituicoes" component={Foundation} />
                  <Route exact path="/programas" component={Program} />
                  <Route exact path="/projetos_submetidos/:id" component={ProjetosSubmetidos} />
                  <Route exact path="/projeto/:id/:coordenador" component={Project} />
                  <Route exact path="/editais/configurar-edital/:id" component={ConfigurationNotice} />
                  <Route exact path="/avaliadores/:id" component={EvaluatorsProgram} />
                  <Route exact path="/editais/:id" component={Notice} />
                  <Route exact path="/avaliadores" component={Evaluator} />
                  <Route exact path="/pesquisadores" component={Researcher} />
                  <Route exact path="/documentos" component={Documentos} />
                  <Route exact path="/documentos/:id/solicitacao" component={EnviarSolicitacao} />
                  <Route exact path="/arquivos" component={Arquivos} />
                  <Route exact path="/publicacoes" component={Publicacoes} />
                  <Route exact path="/avaliacoes" component={ProjetosAvaliacao} />
                  <Route exact path="/atividades" component={Atividades} />
                  <Route exact path="/tarefas/:atividade" component={Tarefas} />
                  <Route exact path="/solicitacoes" component={Contato} />
                  <Route exact path="/submetidos" component={Submetidos} />
                  <Route exact path="/avaliacao/solicitacoes" component={AvaliacaoSolicitacao} />
                  <Route exact path="/atendimentos" component={Atendimento} />
                </Switch>
              </Suspense>
            </div>
          </div>
        </Main>
      </Wrap>
    </LoadingOverlay>
  );
}
