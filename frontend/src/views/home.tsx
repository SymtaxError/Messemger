import React from 'react';
import styles from "views/home.module.css";
import {NewsBlock} from "components/newsBlock";
import {NewsStore} from "../store/newsStore";
import {useMappedStore} from "../utils/store";
import {UsersInChatStore} from "../store/UsersInChatStore";

export const Home: React.FC = () => {

    const [
        newsList
    ] = useMappedStore(NewsStore, x => [
        x.news
    ]);

    return (
        <div className={styles.body}>
            {
                newsList.length
                    ? newsList.map((unit, key) => <NewsBlock title={unit.title} text={unit.text}/>)
                    : undefined
            }
        </div>
    )
};