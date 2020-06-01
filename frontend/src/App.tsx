import React, {CSSProperties, ReactNode, useEffect, useState} from 'react';
import 'App.css';
import {Login} from "views/login"
import {Profile} from "views/profile";
import { Header } from "./components/header";
import {Switch, useLocation, useHistory, Route, Redirect} from "react-router-dom";
import styles from "App.module.css";
import {sendTestMessage} from "./webSockets/messageWS";
import {Messemger} from "views/messemger";

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
                <Route exact path="/">
                    <Redirect to="/home"/>
                </Route>
            </Switch>
            <button className={styles.tempBut} onClick={() => sendTestMessage()}>Test WebS</button>
        </div>
    );
};
