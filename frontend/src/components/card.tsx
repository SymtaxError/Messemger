import React from 'react';
import styles from "components/card.module.css";
import doneImg from "../img/done.png";
import notdoneImg from "img/notdone.png";
import deleteImg from "img/delete.png";

export const Card: React.FC = () => {

    return (
        <div className={styles.card}>
            <div className={styles.done}>
                <img src={doneImg} className={styles.doneImg} alt={""}/>
            </div>
            <div className={styles.task}>Задача 1</div>
            <div className={styles.delete}>
                <img src={deleteImg} className={styles.deleteImg} alt={""}/>
            </div>
        </div>
    )
};