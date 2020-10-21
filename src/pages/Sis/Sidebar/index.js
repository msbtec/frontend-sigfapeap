import React, { memo } from 'react';
import { Link } from 'react-router-dom';

// Styled
import { FiLogOut } from 'react-icons/fi';
import { connect } from 'react-redux';
import { Side } from './styles';

import { useAuth } from '../../../hooks/auth';

// Logo
import Logo from '../../../assets/img/logo.jpg';

// Icons

// Connection Redux

function Sidebar({
  drag, activeMenu, itensMenu, dispatch,
}) {
  const { signOut } = useAuth();

  function toggleMenu(menu) {
    return {
      type: 'SET_MENU_ACTIVE',
      menu,
    };
  }

  return (
    <Side drag={drag}>
      <div className="logo">
        <img src={Logo} alt="" />
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
    </Side>
  );
}

export default memo(
  connect((state) => ({
    activeMenu: state.menu.activeMenu,
    itensMenu: state.menu.itens,
  }))(Sidebar),
);
