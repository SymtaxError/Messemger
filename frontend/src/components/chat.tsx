import React from 'react';
import styles from "components/chat.module.css"
import menuImg from "img/tripleMenu.png"
import { MyMessage }from "./messageComponent";
import {AnMessage} from "./messageComponent";
import {useMappedStore} from "../utils/store";
import {UserStore} from "../store/user";
import {MessagesStore} from "../store/chatContentStore";

export const Chat: React.FC = () => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);

    const [
        name,
        messageList
    ] = useMappedStore(MessagesStore, y => [
        y.name,
        y.content
    ]);

    return (
        <div className={styles.chat}>
            <div className={styles.header}>
                <div className={styles.headerName}>
                    {name}
                </div>
                <img src={menuImg} className={styles.headerImg} alt={""}/>
            </div>
            <div className={styles.content}>
                {
                    messageList.map((unit, key) => {
                        return (unit.owner === user.first_name)
                            ? < MyMessage
                                unit={unit}
                                key={`message-unit-${key}`
                                }/>
                            : < AnMessage
                                unit={unit}
                                key={`message-unit-${key}`
                                }/>
                    })
                }
            </div>
            <div className={styles.enter}>
                <textarea className={styles.sendArea} placeholder="Type your message"/>
                <button className={styles.sendButton}>Отправить</button>
            </div>
        </div>
    )
};