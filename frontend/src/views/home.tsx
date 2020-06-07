import React from 'react';
import styles from "views/home.module.css";
import {NewsBlock} from "components/newsBlock";
import {NewsStore} from "../store/newsStore";
import {useMappedStore} from "../utils/store";
import {UsersInChatStore} from "../store/UsersInChatStore";
import {UserStore} from "../store/user";

export const Home: React.FC = () => {

    const [
        userData
    ] = useMappedStore(UserStore, user => [
        user
    ]);


    const [
        newsList
    ] = useMappedStore(NewsStore, x => [
        x.news
    ]);

    return (
        <div className={styles.body}>
            {
                userData.user.is_superuser
                    ? <div>as</div>
                    : undefined
            }

            {
                newsList.length
                    ? newsList.map((unit, key) => <NewsBlock title={unit.title} text={unit.text}/>)
                    : undefined
            }
        </div>
    )
};