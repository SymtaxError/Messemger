import React, {CSSProperties, ReactNode, useEffect, useState} from 'react';
import 'App.css';
import {Login} from "views/login"
import {Profile} from "views/profile";
import { Header} from "./components/header";
import {Switch, useLocation, useHistory, Route, Redirect} from "react-router-dom"

export const App: React.FC = () => {

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
        </div>
        /*root up here pls*/
    );
}
