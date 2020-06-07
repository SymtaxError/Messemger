import React from "react";
import styles from "./user.module.css";

export const User: React.FC = () => {

    return (
        <div className={styles.user}>
            <div className={styles.name}>Ростя</div>
            <div className={styles.tag}>#таге</div>
        </div>
    )
};