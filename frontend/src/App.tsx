import React, {CSSProperties, ReactNode} from 'react';
import 'App.css';
import styles from "App.module.css";
import { Login } from "views/login"
import {Profile} from "./views/profile";

export const App: React.FC = () => {

    return (
        <div>
            <div className={styles.header}>asd</div>

            {Login}

        </div>
        /*root up here pls*/
    );
}
