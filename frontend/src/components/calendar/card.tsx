import styles from "./card.module.css";
import moreImg from "img/more.png";
import React from "react";

export const Card: React.FC = () => {

    return (
        <div className={styles.card}>
            <div className={styles.content}>Уроки</div>
            <img src={moreImg} className={styles.moreImg} alt={""}/>
        </div>
    )
};