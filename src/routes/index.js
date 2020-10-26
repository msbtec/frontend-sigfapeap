import React, {  Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import store from '../store';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import '../styles/global.css';
import { useAuth } from '../hooks/auth';

const SignIn = lazy(() => import('../pages/public/SignIn'));
const SignUp = lazy(() => import('../pages/public/SignUp'));
const RecoveryPassword = lazy(() => import('../pages/public/RecoveryPassword'));

const Sis = lazy(() => import('../pages/Sis'));

const PrivateRoute = ({ component: Component, ...rest}) => {
    const { signed } = useAuth();

    return (
        <Route {...rest} render={props => (
            signed ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )
        )} />
    )
} ;



export default function Routes(){
    return (
        <Router>
            <Suspense fallback={
                <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center'}}>
                    <div className="loader"></div>
                </div>
            }>
                <Switch>
                    <Route path="/login" component={SignIn} />
                    <Route path="/cadastro" component={SignUp} />
                    <Route path="/recuperacao-senha" component={RecoveryPassword} />
                    <Provider store={store}>
                        <PrivateRoute path="/" component={Sis}/>
                    </Provider>
                </Switch>
            </Suspense>
        </Router>
    );
}


