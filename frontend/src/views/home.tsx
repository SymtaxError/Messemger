import React, {useState} from 'react';
import styles from "views/home.module.css";
import {NewsBlock} from "components/newsBlock";
import {NewsStore} from "../store/newsStore";
import {useMappedStore} from "../utils/store";
import {UserStore} from "../store/user";
import {sendNewRequest} from "../api/http";

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

    const [title, setTitle] = useState<string>("");
    const [text, setText] = useState<string>("");

    return (
        <div className={styles.body}>
            {
                !userData.user.is_superuser // убрать отрицание!
                    ?
                    (<div className={styles.superUserInput}>
                        <input className={styles.superUserHeader}
                               placeholder={"Заголовок"}
                               value={title}
                               onChange={a => setTitle(a.target.value)}/>
                        <textarea className={styles.superUserArea}
                                  placeholder={"Важное сообщение!"}
                                  value={text}
                                  onChange={a => setText(a.target.value)}/>
                        <div className={styles.superUserSend}
                             onClick={async () => {
                                 if (text && title) {
                                     await sendNewRequest(title, text)
                                         .then(() => NewsStore.getNews());
                                     setTitle("");
                                     setText("");
                                 }
                             }}>
                            Отправить
                        </div>
                    </div>)
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