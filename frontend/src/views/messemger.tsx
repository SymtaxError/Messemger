import React from 'react'
import styles from "views/messemger.module.css"
import {ChatMin} from "components/chatMin"
import {Chat} from "components/chat"
import {RightBar} from "../components/rightBar";
import {useMappedStore} from "../utils/store";
import {ChatStore} from "store/chatListStore";
import plusImg from "img/plus.png"
import {createGroupChat} from "api/http";

export const Messemger: React.FC = () => {

    const [
        chatList
    ] = useMappedStore(ChatStore, x => [
        x.chats
    ]);

    return (
        <div className={styles.body}>
            <div className={styles.leftBarOpen}>
                <div className={styles.leftBarHeader}>
                    <div className={styles.leftBarText}>Список чатов</div>
                    <img src={plusImg} className={styles.leftBarImg}
                         onClick={
                             async () => {
                                 await createGroupChat("test1")
                                     .then(() => ChatStore.updateChatList());
                             }
                         }
                    />
                </div>
                {
                    (chatList?.length)
                        ? chatList.map((unit, key) => <ChatMin unit={unit} key={`chatMin-unit-${key}`}/>)
                        : <div className={styles.leftBarText}>У Вас нет чатов!</div>
                }
            </div>
            <Chat/>
            <div className={styles.rightBar}>
                <RightBar/>
            </div>
        </div>
    )
};