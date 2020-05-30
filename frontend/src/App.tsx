import React, {CSSProperties, ReactNode, useEffect, useState} from 'react';
import 'App.css';
import styles from "App.module.css";
import {Login} from "views/login"
import {Profile} from "views/profile";
import todoImg from "img/todo.png";
import homeImg from "img/home.png";
import calendarImg from "img/calendar.png";
import userImg from "img/user.png";
import {Switch, useLocation, Route, Redirect} from "react-router-dom"

export const App: React.FC = () => {

    const [width, setWidth] = useState(window.innerWidth);
    const updateWidth = () => {
        setWidth(window.innerWidth);
    };
    useEffect(() => {
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    });

    const location = useLocation();

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.firstBlock}>
                    <div className={styles.imgBlock}>
                        <img src={homeImg} className={styles.headerImg}/>
                        <div className={styles.imgLabel}>Home</div>
                    </div>
                    {/*{width > 1000 ? <div>asd</div> : <div>asdd</div>}*/}
                    <div className={styles.imgBlock}>
                        <img src={todoImg} className={styles.headerImg}/>
                        <div className={styles.imgLabel}>ToDo</div>
                    </div>
                    <div className={styles.imgBlock}>
                        <img src={calendarImg} className={styles.headerImg}/>
                        <div className={styles.imgLabel}>Calendar</div>
                    </div>
                </div>
                <div className={styles.secondBlock}>
                    <div className={styles.imgBlockRight}>
                        <div className={styles.imgLabelRight}>Profile</div>
                        <img src={userImg} className={styles.headerImg}/>
                    </div>

                </div>
            </div>
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
