import React, { useState, Suspense, lazy } from 'react';
import { Switch, Link } from 'react-router-dom';

import { store } from 'react-notifications-component';

import LoadingOverlay from 'react-loading-overlay';
import { FiMenu } from 'react-icons/fi';
import socket from '../../services/socket';

import Route from "../../routes/Route";

import { useAuth } from '../../hooks/auth';
import { useProject } from '../../hooks/project';
import { useProgram } from '../../hooks/program';

// Icons

// Styled Components
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
const Publicacoes = lazy(() => import('../private/Publicacoes'));

const Tables = lazy(() => import('./Tables'));
const Buttons = lazy(() => import('./Buttons'));
const Cards = lazy(() => import('./Cards'));
const Forms = lazy(() => import('./Forms'));
const Alerts = lazy(() => import('./Alerts'));
const Modals = lazy(() => import('./Modals'));

export default function Sis() {
  const { user } = useAuth();

  const { changeStatus } = useProgram();

  const { loading } = useProject();

  const [data, setData] = useState(null);

  React.useEffect(() => {
    socket.connect();
    socket.subscribeToChannel('notice', 'message', (data) => {
      setData(data)
      store.addNotification({
        message: `Houve uma atualização no edital: ${data.title}`,
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
  }, []);

  React.useEffect(() => {
    changeStatus();
  },[data])

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
                  <Route exact path="/publicacoes" component={Publicacoes} />

                  <Route path="/tables" component={Tables} />
                  <Route path="/buttons" component={Buttons} />
                  <Route path="/cards" component={Cards} />
                  <Route path="/forms" component={Forms} />
                  <Route path="/alerts" component={Alerts} />
                  <Route path="/modals" component={Modals} />
                </Switch>
              </Suspense>
            </div>
          </div>
        </Main>
      </Wrap>
    </LoadingOverlay>
  );
}
