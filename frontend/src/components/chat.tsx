import React, {useState} from 'react';
import styles from "components/chat.module.css"
import menuImg from "img/tripleMenu.png"
import { MyMessage }from "./messageComponent";
import {AnMessage} from "./messageComponent";
import {useMappedStore} from "../utils/store";
import {UserStore} from "../store/user";
import {ChatType} from "../api/models/chatType";
import {sendWSMessage} from "../webSockets/messageWS";
import {ChatStore} from "../store/chatListStore";
import {MessageType} from "../api/models/messageType";

interface ChatProps {
    chat?: ChatType
}

export const Chat: React.FC<ChatProps> = props => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);

    const [pendingMsg, setPendingMsg] = useState("");

    const sendMessage = (msg: string, ws: WebSocket): void => {
        sendWSMessage(ws, msg);
        setPendingMsg("");
    };

    if (!props.chat)
        return <div />;

    const connection = props.chat.connection;

    return (
        <div className={styles.chat}>
            <div className={styles.header}>
                <div className={styles.headerName}>
                    {props.chat?.name}
                </div>
                <img src={menuImg} className={styles.headerImg} alt={""}/>
            </div>
            <div className={styles.content}>
                {
                    props.chat?.messages.map((unit, key) => {
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
                <textarea className={styles.sendArea} onChange={a => setPendingMsg(a.target.value)} placeholder="Type your message"/>
                <button className={styles.sendButton} onClick={() => sendMessage(pendingMsg, connection)}>Отправить</button>
            </div>
        </div>
    )
};