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
      name: 'Perfis de acesso',
      icon: <FiGrid />,
      path: '/perfis',
    },
    {
      name: 'Cargos',
      icon: <FiGrid />,
      path: '/cargos',
    },
    {
      name: 'Documentos',
      icon: <FiGrid />,
      path: '/documentos',
    },
    {
      name: 'Publicações',
      icon: <FiGrid />,
      path: '/publicacoes',
    },
    {
      name: 'Usuários',
      icon: <FiGrid />,
      path: '/usuarios',
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
      name: 'Pesquisadores',
      icon: <FiGrid />,
      path: '/pesquisadores',
    },
    {
      name: 'Avaliadores',
      icon: <FiGrid />,
      path: '/avaliadores',
    },
    {
      name: 'Programas',
      icon: <FiGrid />,
      path: '/programas',
    },
    {
      name: 'Avaliações',
      icon: <FiGrid />,
      path: '/avaliacoes',
    },
    {
      name: 'Submetidos',
      icon: <FiGrid />,
      path: '/submetidos',
    },
    {
      name: 'Atividades',
      icon: <FiGrid />,
      path: '/atividades',
    },
    {
      name: 'Solicitações',
      icon: <FiGrid />,
      path: '/solicitacoes',
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
