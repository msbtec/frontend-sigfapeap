import React from 'react';

// Icons
import {
  FiHome, FiGrid, FiPhoneForwarded,
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
      path: '/tables',
    },
    {
      name: 'Cargos',
      icon: <FiGrid />,
      path: '/tables',
    },
    {
      name: 'Perfis de acesso',
      icon: <FiGrid />,
      path: '/tables',
    },
    {
      name: 'Área de pesquisa',
      icon: <FiGrid />,
      path: '/tables',
    },
    {
      name: 'Instituição de pesquisa',
      icon: <FiGrid />,
      path: '/tables',
    },
    {
      name: 'Programas',
      icon: <FiGrid />,
      path: '/tables',
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
