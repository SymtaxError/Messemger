import React from 'react';
import styles from "components/todo/card.module.css";
import doneImg from "../../img/done.png";
import deleteImg from "img/delete.png";
import {CardType} from "../../api/models/todoModel";

interface CardProps {
    unit: CardType
}

export const Card: React.FC<CardProps> = x => {
    return (
        <div className={styles.card}>
            <div className={styles.done}>
                <img src={doneImg} className={styles.doneImg} alt={""}/>
            </div>
            <div className={styles.task}>{x.unit.cardTitle}</div>
            <div className={styles.delete}>
                <img src={deleteImg} className={styles.deleteImg} alt={""}/>
            </div>
        </div>
    )
};