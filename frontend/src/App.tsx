import React, {CSSProperties, ReactNode, useEffect, useState} from 'react';
import 'App.css';
import {Login} from "views/login"
import {Profile} from "views/profile";
import { Header} from "./components/header";
import {Switch, useLocation, useHistory, Route, Redirect} from "react-router-dom";
import styles from "App.module.css";

export const App: React.FC = () => {

    const webSocket = new WebSocket(`ws://localhost:8000/servers/chat/1/?${localStorage.getItem("access")}/`);

    const sendTestMessage = () => {
        const msg = {
            user: "Durak",
            action: "chat_message",
            params: {
                "text": "testim-testim",
            },
        };

        webSocket.send(JSON.stringify(msg));
    };

    webSocket.onmessage = (event) => {
        alert(event.data);
    };


    const location = useLocation();

    return (
        <div>
            <Header/>
            <Switch location={location}>
                <Route path="/login"
                       component={Login}/>
                <Route path="/profile"
                       component={Profile}/>
                <Route exact path="/">
                    <Redirect to="/home"/>
                </Route>

            </Switch>
            <button className={styles.tempBut} onClick={() => sendTestMessage()}>Test WebS</button>
        </div>
    );
}
