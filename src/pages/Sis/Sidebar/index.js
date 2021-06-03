import React, { memo } from 'react';
import { Link } from 'react-router-dom';

import { FiLogOut, FiGrid, FiHome } from 'react-icons/fi';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Side } from './styles';

import { useAuth } from '../../../hooks/auth';
import { useContact } from '../../../hooks/contact';

import Logo from '../../../assets/img/logo.png';

function Sidebar({
  drag, activeMenu, itensMenu, dispatch,
}) {
  const { user, signOut } = useAuth();

  const { notResponding } = useContact();

  function toggleMenu(menu) {
    return {
      type: 'SET_MENU_ACTIVE',
      menu,
    };
  }

  React.useEffect(() => {
    function toggleItem(itens) {
      return {
        type: 'SET_MENU_ITEM',
        itens,
      };
    }

    const profiles = JSON.parse(user.profile.access).map((item) => String(item.label));

    const my_profiles = [{
      name: 'Dashboard',
      icon: <FiHome />,
      path: '/',
    }];

    if (profiles.includes('Perfis de acesso')) {
      my_profiles.push({
        name: 'Perfis de acesso',
        icon: <FiGrid />,
        path: '/perfis',
      });
    }

    if (profiles.includes('Cargos')) {
      my_profiles.push({
        name: 'Cargos',
        icon: <FiGrid />,
        path: '/cargos',
      });
    }

    if (profiles.includes('Documentos')) {
      my_profiles.push({
        name: 'Documentos',
        icon: <FiGrid />,
        path: '/documentos',
      });
    }

    if (profiles.includes('Publicações')) {
      my_profiles.push({
        name: 'Publicações',
        icon: <FiGrid />,
        path: '/publicacoes',
      });
    }

    if (profiles.includes('Servidores')) {
      my_profiles.push({
        name: 'Usuários',
        icon: <FiGrid />,
        path: '/usuarios',
      });
    }

    if (profiles.includes('Área de pesquisa')) {
      my_profiles.push({
        name: 'Área de pesquisa',
        icon: <FiGrid />,
        path: '/areas',
      });
    }

    if (profiles.includes('Instituição de pesquisa')) {
      my_profiles.push({
        name: 'Instituição de pesquisa',
        icon: <FiGrid />,
        path: '/instituicoes',
      });
    }

    if (profiles.includes('Pesquisadores')) {
      my_profiles.push({
        name: 'Pesquisadores',
        icon: <FiGrid />,
        path: '/pesquisadores',
      });
    }

    if (profiles.includes('Avaliadores')) {
      my_profiles.push({
        name: 'Avaliadores',
        icon: <FiGrid />,
        path: '/avaliadores',
      });
    }

    if (profiles.includes('Programas')) {
      my_profiles.push({
        name: 'Programas',
        icon: <FiGrid />,
        path: '/programas',
      });
    }

    if (profiles.includes('Submetidos')) {
      my_profiles.push({
        name: 'Submetidos',
        icon: <FiGrid />,
        path: '/submetidos',
      });
    }

    if (profiles.includes('Atividades')) {
      my_profiles.push({
        name: 'Atividades',
        icon: <FiGrid />,
        path: '/atividades',
      });
    }

    if (profiles.includes('Avaliações')) {
      my_profiles.push({
        name: 'Avaliações',
        icon: <FiGrid />,
        path: '/avaliacoes',
      });
    }

    if (profiles.includes('Fale Conosco')) {
      my_profiles.push({
        name:
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: -4,
  }}
  >
    <h1 style={{ fontWeight: '500', color: '#a2a3b7', fontSize: 13 }}>
      Fale Conosco
    </h1>
    {notResponding > 0
    && (
    <div style={{
      backgroundColor: "#080", paddingLeft: 10, paddingRight: 10, paddingBottom: 2, paddingTop: 4, borderRadius: 5, marginLeft: 10, justifyContent: 'center', alignItems: 'center',
    }}
    >
      <h3 style={{
        color: "#fff", fontSize: 13,
      }}
      >
        {notResponding}
      </h3>
    </div>
    )}
  </div>,
        icon: <BsFillChatDotsFill />,
        path: '/solicitacoes/Regular',
      });
    }

    dispatch(toggleItem(my_profiles));
  }, [user, dispatch, notResponding]);

  return (

    <Side drag={drag}>
      <PerfectScrollbar>

        <div className="logo">
          <img style={{ width: 200, height: 50 }} src={Logo} alt="" />
        </div>

        <ul>
          {itensMenu.map((item) => (
            <li key={item.name} className={item.name === activeMenu.name ? 'active' : ''}>
              <Link to={item.path} onClick={() => dispatch(toggleMenu(item))}>
                <span className="icon">
                  { item.icon }
                </span>
                <span className="item">
                  { item.name }
                </span>
              </Link>
            </li>
          ))}

          <li>
            <Link onClick={() => signOut()} to="/login">
              <span className="icon">
                <FiLogOut />
              </span>
              <span className="item">
                Sair
              </span>
            </Link>
          </li>
        </ul>
      </PerfectScrollbar>

    </Side>
  );
}

export default memo(
  connect((state) => ({
    activeMenu: state.menu.activeMenu,
    itensMenu: state.menu.itens,
  }))(Sidebar),
);
