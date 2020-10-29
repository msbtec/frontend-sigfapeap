import React from 'react';

// Icons
import {
  FiHome, FiGrid,
} from 'react-icons/fi';

const INITIAL_STATE = {
  activeMenu: {
    name: 'Dashboard',
    icon: <FiHome />,
    path: '/',
  },
  itens: [
    {
      name: 'Dashboard',
      icon: <FiHome />,
      path: '/',
    },
    {
      name: 'Servidores',
      icon: <FiGrid />,
      path: '/servidores',
    },
    {
      name: 'Cargos',
      icon: <FiGrid />,
      path: '/cargos',
    },
    {
      name: 'Perfis de acesso',
      icon: <FiGrid />,
      path: '/perfis',
    },
    {
      name: 'Área de pesquisa',
      icon: <FiGrid />,
      path: '/areas',
    },
    {
      name: 'Instituição de pesquisa',
      icon: <FiGrid />,
      path: '/instituicoes',
    },
    {
      name: 'Programas',
      icon: <FiGrid />,
      path: '/programas',
    },
    {
      name: 'Avaliadores',
      icon: <FiGrid />,
      path: '/tables',
    },
    {
      name: 'Pesquisadores',
      icon: <FiGrid />,
      path: '/tables',
    },
  ],
};

export default function sidebarMenu(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_MENU_ACTIVE':
      return { ...state, activeMenu: action.menu };
      break;
    default:
      return state;
      break;
  }
}
