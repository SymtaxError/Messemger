import React, {CSSProperties, ReactNode, useEffect, useState} from 'react';
import 'App.css';
import {Login} from "views/login"
import {Profile} from "views/profile";
import { Header } from "./components/header";
import {Switch, useLocation, useHistory, Route, Redirect} from "react-router-dom";
import styles from "App.module.css";
import {sendTestMessage} from "webSockets/messageWS";
import {Messemger} from "views/messemger";
import {Home} from "views/home"

export const App: React.FC = () => {

    const location = useLocation();

    return (
        <div className={styles.app}>
            <Header/>
            <Switch location={location}>
                <Route path="/login"
                       component={Login}/>
                <Route path="/profile"
                       component={Profile}/>
                <Route path="/chat"
                       component={Messemger}/>
                <Route path="/home"
                       component={Home}/>
                <Route exact path="/">
                    <Redirect to="/home"/>
                </Route>
            </Switch>
        </div>
    );
};
