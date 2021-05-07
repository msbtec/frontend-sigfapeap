import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../hooks/auth";

export default function RouteWrapper({
  component: Component,
  ...rest
}) {
  const { user } = useAuth();

  const access = JSON.parse(user.profile.access).map((item) => String(item.value));

  let path = '';

  if (rest.path === '/' || rest.path === '/perfil') {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  }

  if (rest.path === '/usuarios') {
    path = "Servidores";
  }
  if (rest.path === '/cargos') {
    path = "Cargos";
  }
  if (rest.path === '/perfis') {
    path = "Perfis de acesso";
  }
  if (rest.path === '/areas') {
    path = "Área de pesquisa";
  }
  if (rest.path === '/instituicoes') {
    path = "Instituição de pesquisa";
  }
  if (rest.path === '/programas' || rest.path === '/projetos_submetidos/:id' || rest.path === '/projeto/:id/:coordenador' || rest.path === '/editais/configurar-edital/:id' || rest.path === '/avaliadores/:id' || rest.path === '/editais/:id') {
    path = "Programas";
  }
  if (rest.path === '/avaliadores') {
    path = "Avaliadores";
  }
  if (rest.path === '/pesquisadores') {
    path = "Pesquisadores";
  }
  if (rest.path === '/documentos') {
    path = "Documentos";
  }
  if (rest.path === '/publicacoes') {
    path = "Publicações";
  }
  if (rest.path === '/avaliacoes') {
    path = "Avaliações";
  }
  if (rest.path === '/atividades' || rest.path === '/tarefas/:atividade') {
    path = "Atividades";
  }

  if (!access.includes(String(path))) {
    return <Redirect to="/" />;
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
}
