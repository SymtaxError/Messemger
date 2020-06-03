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

interface ChatProps {
    chat?: ChatType
}

export const Chat: React.FC<ChatProps> = props => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);
    const [chats] = useMappedStore(ChatStore, x => [x.chats]);
    const chat = chats.find(a => a.id === props.chat?.id);

    const [pendingMsg, setPendingMsg] = useState("");


    const sendMessage = (msg: string, ws: WebSocket): void => {
        sendWSMessage(ws, msg);
        setPendingMsg("");
    };

    if (!chat)
        return <div />;

    const connection = chat.connection;

    return (
        <div className={styles.chat}>
            <div className={styles.header}>
                <div className={styles.headerName}>
                    {chat.name}
                </div>
                <img src={menuImg} className={styles.headerImg} alt={""}/>
            </div>
            <div className={styles.content}>
                {
                    chat.messages.map((unit, key) => {
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
                <button className={styles.sendButton} onClick={() => ChatStore.addMessage({id: 1, message: "msg", owner: "idk"})}>Отправить</button>
            </div>
        </div>
    )
};