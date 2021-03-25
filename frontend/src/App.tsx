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
import {Profile} from "./views/profile";
import {Calendar} from "./views/calendar";

export const App: React.FC = () => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);

    const location = useLocation();

    return (
        <div className={styles.app}>
            <Header user={user}/>
            <Switch location={location}>
                <PrivateRoute condition={user.first_name === ""}
                              path="/login"
                              component={Login}/>
                <PrivateRoute condition={user.first_name !== ""}
                              path="/todo"
                              component={Todo}/>
                <PrivateRoute condition={user.first_name !== ""}
                              path="/chat"
                              component={Messemger}/>
                <PrivateRoute condition={user.first_name !== ""}
                              path="/profile"
                              component={Profile}/>
                <PrivateRoute condition={user.first_name !== ""}
                              path="/home"
                              component={Home}/>
                <Route exact path="/">
                    <Redirect to="/home"/>
                </Route>
            </Switch>
        </div>
    );
};
