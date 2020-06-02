import React from 'react'
import styles from "components/chatMin.module.css"
import arrowImg from "img/arrow.png"
import {MessageType} from "../api/models/messageType";
import {ChatType} from "api/models/chatType";

interface chatMinComponentProps {
    unit: ChatType
}

export const ChatMin: React.FC<chatMinComponentProps> = x => {

    return (
        <div className={styles.dialog}>
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