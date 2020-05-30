import React, {CSSProperties, ReactNode} from 'react';
import 'App.css';
import styles from "App.module.css";
// import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import { Login } from "views/login"
import {Profile} from "./views/profile";

export const App: React.FC = () => {
    return (
        <div>
            <div className={styles.header}></div>
            <Login/>
        </div>
        /*root up here pls*/
    );
}
