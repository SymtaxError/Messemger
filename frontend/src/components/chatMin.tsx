import React from 'react'
import styles from "components/chatMin.module.css"
import arrowImg from "img/arrow.png"
import {ChatType} from "api/models/chatType";

interface chatMinComponentProps {
    unit: ChatType
    onClick?: () => void
}

export const ChatMin: React.FC<chatMinComponentProps> = x => {

    return (
        <div className={styles.dialog} onClick={x.onClick}>
            <div className={styles.dialogImg}>
                {x.unit.type_chat}
            </div>
            <div className={styles.dialogContent}>
                {x.unit.name}
            </div>
            <img src={arrowImg} className={styles.arrowImg} alt={""}/>
        </div>
    )
};