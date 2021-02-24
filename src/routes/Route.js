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

  if (rest.path === '/') {
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
  if (rest.path === '/programas') {
    path = "Programas";
  }
  if (rest.path === '/avaliadores') {
    path = "Avaliadores";
  }
  if (rest.path === '/pesquisadores') {
    path = "Pesquisadores";
  }

  if (!access.includes(String(path))) {
    return <Redirect to="/" />;
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
}