import React, {ReactNode, useEffect, useState} from "react";
import styles from "components/header.module.css";
import homeImg from "img/home.png";
import todoImg from "img/todo.png";
import calendarImg from "img/calendar.png";
import userImg from "img/user.png";
import {useHistory} from "react-router-dom";
import {useMappedStore} from "../utils/store";
import {UserStore} from "../utils/store/user";

export const Header: React.FC = () => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);

    const [width, setWidth] = useState(window.innerWidth);
    const updateWidth = () => {
        setWidth(window.innerWidth);
    };
    useEffect(() => {
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    });

    let history = useHistory();

    const profileElement: ReactNode = (
        <div className={styles.imgBlockRight} onClick={() => history.push("/profile")}>
            <div className={styles.imgLabelRight}>{user.first_name}</div>
            <img src={userImg} className={styles.headerImg}/>
        </div>
    );

    const loginElement: ReactNode = (
        <div className={styles.imgBlockRight} onClick={() => history.push("/login")}>
            <div className={styles.imgLabelRight}>Вход</div>
            <img src={userImg} className={styles.headerImg}/>
        </div>
    );

    return (
        <div className={styles.header}>
            <div className={styles.firstBlock}>
                <div className={styles.imgBlock} onClick={() => history.push("/home")}>
                    <img src={homeImg} className={styles.headerImg}/>
                    <div className={styles.imgLabel}>Home</div>
                </div>
                {/*{width > 1000 ? <div>asd</div> : <div>asdd</div>}*/}
                <div className={styles.imgBlock} onClick={() => history.push("/todo")}>
                    <img src={todoImg} className={styles.headerImg}/>
                    <div className={styles.imgLabel}>ToDo</div>
                </div>
                <div className={styles.imgBlock} onClick={() => history.push("/calendar")}>
                    <img src={calendarImg} className={styles.headerImg}/>
                    <div className={styles.imgLabel}>Calendar</div>
                </div>
            </div>
            <div className={styles.secondBlock}>
                {user.first_name ? profileElement : loginElement}
            </div>
        </div>
    );
};