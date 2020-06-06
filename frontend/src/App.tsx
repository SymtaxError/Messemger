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
import {AddChatComponent} from "./components/addChatComponent";

export const App: React.FC = () => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);

    const location = useLocation();

    return (
        <div className={styles.app}>
            <Header/>
            <Switch location={location}>
                <PrivateRoute condition={true}
                              path="/login"
                              component={Login}/>
                {/*<Route path="/login"*/}
                {/*       component={Login}/>*/}
                <PrivateRoute condition={true}
                              path="/todo"
                              component={Todo}/>
                <PrivateRoute condition={true}
                              path="/chat"
                              component={Messemger}/>
                <PrivateRoute condition={true}
                              path="/profile"
                              component={Profile}/>
                <PrivateRoute condition={true}
                              path="/home"
                              component={Home}/>
                <PrivateRoute condition={true}
                              path="/calendar"
                              component={Calendar}/>
                <Route exact path="/">
                    <Redirect to="/home"/>
                </Route>
            </Switch>
        </div>
    );
};
