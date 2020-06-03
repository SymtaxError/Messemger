import React from 'react';
import 'App.css';
import {Login} from "views/login"
import {Header} from "components/header";
import {Switch, useLocation, Route, Redirect} from "react-router-dom";
import styles from "App.module.css";
import {Messemger} from "views/messemger";
import {getChatList} from "api/http";
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

    const location = useLocation();

    return (
        <div className={styles.app}>
            <Header/>
            <Switch location={location}>
                <Route path="/login"
                       component={Login}/>
                <PrivateRoute condition={user.first_name === ""}
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
            <button className={styles.tempBut} onClick={() => getChatList()}>Get chat list</button>
        </div>
    );
};
