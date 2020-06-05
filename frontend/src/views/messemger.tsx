import React, {useState} from 'react'
import styles from "views/messemger.module.css"
import {ChatMin} from "components/chatMin"
import {Chat} from "components/chat"
import {RightBar} from "../components/rightBar";
import {useMappedStore} from "../utils/store";
import {ChatStore, MessageType} from "store/chatListStore";
import plusImg from "img/plus.png"
import deletewhiteImg from "img/deletewhite.png";
import {createGroupChat} from "api/http";
import {ChatType} from "../api/models/chatType";
import {AddChatComponent} from "components/addChatComponent";

export const Messemger: React.FC = () => {

    const [isCreate, setIsCreate] = useState(false);

    const [
        chatList
    ] = useMappedStore(ChatStore, x => [
        x.chats
    ]);

    const [selectedChat, setSelectedChat] = useState<ChatType>();

    return (
        <div className={styles.body}>
            {isCreate ? <AddChatComponent/> : undefined}
            <div className={styles.leftBarOpen}>
                <div className={styles.leftBarHeader}>
                    <div className={styles.leftBarText}>чат1</div>
                    <div className={styles.deleteDesk}>
                        <img src={deletewhiteImg} className={styles.deletewhiteImg}/>
                    </div>
                </div>
                <div className={styles.leftBarHeader}>
                    <div className={styles.leftBarText}>чат2</div>
                    <div className={styles.deleteDesk}>
                        <img src={deletewhiteImg} className={styles.deletewhiteImg}/>
                    </div>
                </div>
                {
                    (chatList?.length)
                        ? chatList.map((unit, key) => <ChatMin unit={unit} key={`chatMin-unit-${key}`} onClick={() => setSelectedChat(unit)}/>)
                        : <div className={styles.leftBarText}>У Вас нет чатов!</div>
                }
                <div className={styles.leftBarHeader}>
                    <img src={plusImg} className={styles.leftBarImg} alt={""}
                         onClick={
                             () => setIsCreate(!isCreate)
                         }
                    />
                </div>

                {
                    (chatList?.length)
                        ? chatList.map((unit, key) => <ChatMin unit={unit} key={`chatMin-unit-${key}`}
                                                               onClick={async () => {
                                                                   setSelectedChat(unit);
                                                                   ChatStore.getMessagesForChat(unit.id);
                                                               }}/>)
                        : <div className={styles.leftBarText}>У Вас нет чатов!</div>
                }
            </div>
            <div className={styles.chatField}>
                
            </div>

            <Chat chat={selectedChat}/>
            <div className={styles.rightBar}>
                <RightBar/>
            </div>
        </div>
    )
};