import React from "react";
import styles from "./newsBlock.module.css";

export const NewsBlock: React.FC = () => {

    return (
        <div className={styles.newsBlock}>
            <div className={styles.header}>Заголовок Заголовок Заголовок Заголовок</div>
            <div className={styles.content}>
                МногоМного МногоМного МногоМного МногоМного МногоМного
            МногоМного МногоМного МногоМного МногоМного
            МногоМного МногоМного МногоМного МногоМного МногоМного
            МногоМного МногоМного МногоМного МногоМного
            МногоМного МногоМного МногоМного МногоМного МногоМного
            МногоМного МногоМного МногоМного МногоМноготекста</div>
        </div>
    )
};