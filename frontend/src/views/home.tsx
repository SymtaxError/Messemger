import React from 'react';
import styles from "views/home.module.css";
import {NewsBlock} from "components/newsBlock";

export const Home: React.FC = () => {
    return(
        <div className={styles.body}>
            <NewsBlock/>
            <NewsBlock/>
            <NewsBlock/>
            <NewsBlock/>
            <NewsBlock/>
        </div>
    )
};