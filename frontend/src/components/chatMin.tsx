import React from 'react'
import styles from "components/chatMin.module.css"
import arrowImg from "img/arrow.png"
import {MessageType} from "../api/models/messageType";
import {ChatType} from "api/models/chatType";
import {getMessagesRequest} from "../api/http";
import {useMappedStore} from "../utils/store";
import {MessagesStore} from "../store/chatContentStore";

interface chatMinComponentProps {
    unit: ChatType
}

export const ChatMin: React.FC<chatMinComponentProps> = x => {

    return (
        <div className={styles.dialog}
             onClick={
                 async () => {
                     const response = await getMessagesRequest(x.unit.id);
                     console.log(response);
                     MessagesStore.setMessages(response);
                 }
             }
        >
            <div className={styles.dialogImg}>
                {x.unit.picture}
            </div>
            <div className={styles.dialogContent}>
                {x.unit.name}
            </div>
            <img src={arrowImg} className={styles.arrowImg}/>


        </div>
    )
};