import React from 'react';
import styles from "components/chat.module.css"
import {MessageType} from "store/chatListStore";

interface messageComponentProps {
    unit: MessageType
}

export const AnMessage: React.FC<messageComponentProps> = x => {
    return (
        <div className={styles.anotherMsg}>
            <div className={styles.msgContent}>
                <div className={styles.msgAuthor}>{x.unit.user}</div>
                <div className={styles.msgText}>{x.unit.params.text}</div>
                <div className={styles.msgDate}>date</div>
            </div>
        </div>
    )
};

export const MyMessage: React.FC<messageComponentProps> = x => {
    return (
        <div className={styles.myMsg}>
            <div className={styles.msgContent}>
                <div className={styles.msgAuthor}>{x.unit.user}</div>
                <div className={styles.msgText}>{x.unit.params.text}</div>
                <div className={styles.msgDate}>date</div>
            </div>
        </div>
    )
};
