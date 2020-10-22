import React, { useState, Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';

// Icons
import { FiMenu } from 'react-icons/fi';

// Styled Components
import Sidebar from './Sidebar';
import { Wrap, Main, NavBar } from './styles';

const Dashboard = lazy(() => import('./Dashboard'));
const Server = lazy(() => import('../private/Server'));

const Tables = lazy(() => import('./Tables'));
const Buttons = lazy(() => import('./Buttons'));
const Cards = lazy(() => import('./Cards'));
const Forms = lazy(() => import('./Forms'));
const Alerts = lazy(() => import('./Alerts'));
const Modals = lazy(() => import('./Modals'));

export default function Sis() {

    const { user } = useAuth();

    const [ drag, setDrag ] = useState(false);
    return (
        <Wrap>
            <Sidebar drag={drag} />
            <Main>
                <NavBar>
                    <FiMenu className="toggle" style={{ marginLeft: drag ? 170 : 0}} onClick={(e) => drag ? setDrag(false) : setDrag(true)} />
                    <span>Olá, <span className="name">{user.name}</span></span>
                </NavBar>
                <div className="content">
                    <div className="row">
                        <Suspense fallback={
                            <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center'}}>
                                <div className="loader"></div>
                            </div>
                        }>
                            <Switch>
                                <Route exact path='/' component={Dashboard} />
                                <Route exact path='/servidores' component={Server} />
                                <Route path='/tables' component={Tables}/>
                                <Route path='/buttons' component={Buttons}/>
                                <Route path='/cards' component={Cards}/>
                                <Route path='/forms' component={Forms}/>
                                <Route path='/alerts' component={Alerts}/>
                                <Route path='/modals' component={Modals}/>
                            </Switch>
                        </Suspense>
                    </div>
                </div>
            </Main>
        </Wrap>
    );
}

