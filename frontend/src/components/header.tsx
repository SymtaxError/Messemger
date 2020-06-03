import React, {ReactNode} from "react";
import styles from "components/header.module.css";
import homeImg from "img/home.png";
import todoImg from "img/todo.png";
import calendarImg from "img/calendar.png";
import userImg from "img/user.png";
import messagerImg from "img/messager.png"
import {useHistory} from "react-router-dom";
import {useMappedStore} from "../utils/store";
import {UserStore} from "../store/user";

export const Header: React.FC = () => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);

    let history = useHistory();

    const profileElement: ReactNode = (
        <div className={styles.imgBlockRight} onClick={() => history.push("/profile")}>
            <div className={styles.imgLabelRight}>{user.first_name}</div>
            <img  src={userImg} className={styles.headerImg} alt={""}/>
        </div>
    );

    const loginElement: ReactNode = (
        <div className={styles.imgBlockRight} onClick={() => history.push("/login")}>
            <div className={styles.imgLabelRight}>Вход</div>
            <img src={userImg} className={styles.headerImg} alt={""}/>
        </div>
    );

    return (
        <div className={styles.header}>
            <div className={styles.firstBlock}>
                <div className={styles.imgBlock} onClick={() => history.push("/home")}>
                    <img src={homeImg} className={styles.headerImg} alt={""}/>
                    <div className={styles.imgLabel}>Home</div>
                </div>

                <div className={styles.imgBlock} onClick={() => history.push("/chat")}>
                    <img src={messagerImg} className={styles.headerImg} alt={""}/>
                    <div className={styles.imgLabel}>Сообщения</div>
                </div>

                <div className={styles.imgBlock} onClick={() => history.push("/todo")}>
                    <img src={todoImg} className={styles.headerImg} alt={""}/>
                    <div className={styles.imgLabel}>План</div>
                </div>

                <div className={styles.imgBlock} onClick={() => history.push("/calendar")}>
                    <img src={calendarImg} className={styles.headerImg} alt={""}/>
                    <div className={styles.imgLabel}>Calendar</div>
                </div>
            </div>
            <div className={styles.secondBlock}>
                {user.first_name ? profileElement : loginElement}
            </div>
        </div>
    );
};