import React from "react";
import styles from "./newsBlock.module.css";

interface NewsBlockProps {
    title: string
    text: string
}

export const NewsBlock: React.FC<NewsBlockProps> = (props) => {

    return (
        <div className={styles.newsBlock}>

            <div className={styles.header}>{props.title}</div>
            <div className={styles.content}>{props.text}</div>
        </div>
    )
};