import React, {ReactNode} from "react";
import styles from "components/header.module.css";
import homeImg from "img/home.png";
import todoImg from "img/todo.png";
import userImg from "img/user.png";
import messagerImg from "img/messager.png"
import {useHistory} from "react-router-dom";
import {useMappedStore} from "../utils/store";
import {UserStore} from "../store/user";
import {ChatStore} from "../store/chatListStore";
import {UserUnit} from "../api/models/user";

interface HeaderProps {
    user: UserUnit
}

export const Header: React.FC<HeaderProps> = (y) => {

    const history = useHistory();

    const profileElement: ReactNode = (
        <div className={styles.imgBlockRight} onClick={() => history.push("/profile")}>
            <div className={styles.imgLabelRight}>{y.user.first_name}</div>
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
                    <div className={styles.imgLabel}>Новости</div>
                </div>
                <div className={styles.imgBlock} onClick={() => {
                    ChatStore.clearChatList();
                    ChatStore.updateChatList();
                    history.push("/chat");
                }}>
                    <img src={messagerImg} className={styles.headerImg} alt={""}/>
                    <div className={styles.imgLabel}>Сообщения</div>
                </div>

                <div className={styles.imgBlock} onClick={() => history.push("/todo")}>
                    <img src={todoImg} className={styles.headerImg} alt={""}/>
                    <div className={styles.imgLabel}>План</div>
                </div>
            </div>
            <div className={styles.secondBlock}>
                {y.user.first_name ? profileElement : loginElement}
            </div>
        </div>
    );
};