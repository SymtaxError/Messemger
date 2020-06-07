import React, {ReactNode, useState, useRef, MutableRefObject, useEffect, RefObject} from 'react';
import styles from "components/chat.module.css"
import menuImg from "img/tripleMenu.png"
import {MyMessage} from "./messageComponent";
import {AnMessage} from "./messageComponent";
import {useMappedStore} from "../utils/store";
import {UserStore} from "../store/user";
import {ChatType} from "../api/models/chatType";
import {sendWSMessage} from "../webSockets/messageWS";
import {ChatStore} from "../store/chatListStore";
import {AddUserComponent} from "components/addUserComponent";

interface ChatProps {
    chat?: ChatType
}

export const Chat: React.FC<ChatProps> = props => {
    const ref = useRef<HTMLDivElement>(null);
    const scroll = (ref: RefObject<HTMLDivElement>) => {
        ref.current?.scrollTo(0, ref.current.offsetTop)
    };

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);
    useEffect(() => {
        if (ref)
            scroll(ref);
    }, []);

    const [chats] = useMappedStore(ChatStore, x => [x.chats]);
    const chat = chats.find(a => a.id === props.chat?.id);

    const [pendingMsg, setPendingMsg] = useState<string>("");
    const [isAddUsers, setIsAddUsers] = useState<boolean>(false);


    const sendMessage = (msg: string, ws: WebSocket): void => {
        sendWSMessage(ws, msg);
        setPendingMsg("");
    };

    if (!chat)
        return <div/>;

    const connection = chat.connection;

    return (
        <div className={styles.chat} ref={ref}>
            {
                isAddUsers
                    ? <AddUserComponent chatId={props.chat?.id}
                                        closeFunction={() => setIsAddUsers(!isAddUsers)}
                                        endFunction={() => alert()}/>
                    : undefined
            }
            <img
                src={
                    "https://cdn.pixabay.com/photo/2018/11/15/22/52/wolf-3818343_960_720.jpg"
                }
            />
            <div className={styles.header}>
                <div className={styles.headerName}>
                    {chat.name}
                </div>
                {
                    (props.chat?.type_chat === "C")
                        ? <img src={menuImg}
                               className={styles.headerImg}
                               alt={""}
                               onClick={() => setIsAddUsers(!isAddUsers)}
                        />
                        : undefined
                }
            </div>
            <div className={styles.content}>
                {
                    chat.messages.map((unit, key) => {
                        return (unit.params.owner_tag === user.tag)
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
                <textarea className={styles.sendArea} onChange={a => setPendingMsg(a.target.value)} value={pendingMsg}
                          placeholder="Напишите сообщение..."/>
                <button className={styles.sendButton} onClick={() => sendMessage(pendingMsg, connection)}>Отправить
                </button>
            </div>
        </div>
    )
};