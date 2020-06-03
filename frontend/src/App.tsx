import React from 'react';
import 'App.css';
import {Login} from "views/login"
import {Header} from "components/header";
import {Switch, useLocation, Route, Redirect} from "react-router-dom";
import styles from "App.module.css";
import {Messemger} from "views/messemger";

import {Todo} from "views/todo"

import {Home} from "views/home";

import {useMappedStore} from "utils/store";
import {UserStore} from "store/user";
import {PrivateRoute} from "PrivateRoute";

export const App: React.FC = () => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);

    console.log(user);

    const location = useLocation();

    return (
        <div className={styles.app}>
            <Header/>
            <Switch location={location}>
                <Route path="/login"
                       component={Login}/>
                <Route path="/todo"
                       component={Todo}/>

                <PrivateRoute condition={true}
                              path="/chat"
                              component={Messemger}/>
                {/*<Route path="/profile"*/}
                {/*       component={Profile}/>*/}
                {/*<Route path="/chat"*/}
                {/*       component={Messemger}/>*/}
                <Route path="/home"
                       component={Home}/>
                <Route exact path="/">
                    <Redirect to="/home"/>
                </Route>
            </Switch>
        </div>
    );
};
