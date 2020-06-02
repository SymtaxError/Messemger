import React, {ReactNode} from 'react';
import styles from "components/chat.module.css"
import menuImg from "img/tripleMenu.png"
import {mockMessageUnits} from "../api/models/messageType";
import { MyMessage }from "./messageComponent";
import {AnMessage} from "./messageComponent";
import {ChatStore} from "../store/chatListStore";
import {useMappedStore} from "../utils/store";
import {UserStore} from "../store/user";

export const Chat: React.FC = () => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);

    return (
        <div className={styles.chat}>
            <div className={styles.header}>
                <div className={styles.headerName}>
                    Name
                </div>
                <img src={menuImg} className={styles.headerImg}/>
            </div>
            <div className={styles.content}>
                {
                    mockMessageUnits.map((unit, key) => {
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
                <button className={styles.sendButton} onClick={() => ChatStore.updateChatList()}>получить фигню</button>
            </div>
        </div>
    )
};