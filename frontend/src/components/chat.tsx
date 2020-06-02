import React, {ReactNode} from 'react';
import styles from "components/chat.module.css"
import menuImg from "img/tripleMenu.png"
import {mockMessageUnits} from "../api/models/message";
// import { myMessage }from "./messageComponent";
import {AnMessage} from "./messageComponent";
export const Chat: React.FC = () => {

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
                    mockMessageUnits.map((unit, key) => <AnMessage unit={unit} key={`message-unit-${key}`}/>)
                }
            </div>
            <div className={styles.enter}>
                <textarea className={styles.sendArea} placeholder ="Type your message"/>
                <button className={styles.sendButton}>Отправить</button>
            </div>
        </div>
    )
};