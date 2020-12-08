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
      name: 'Usuários',
      icon: <FiGrid />,
      path: '/usuarios',
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
      path: '/avaliadores',
    },
    {
      name: 'Pesquisadores',
      icon: <FiGrid />,
      path: '/pesquisadores',
    },
  ],
};

export default function sidebarMenu(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_MENU_ACTIVE':
      return { ...state, activeMenu: action.menu };
      break;
    case 'SET_MENU_ITEM':
      return { ...state, itens: action.itens };
      break;
    default:
      return state;
      break;
  }
}
