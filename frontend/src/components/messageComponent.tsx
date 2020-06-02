import React from 'react';
import styles from "components/chat.module.css"
import {MessageType} from "api/models/messageType";

interface messageComponentProps {
    unit: MessageType
}

export const AnMessage: React.FC<messageComponentProps> = x => {
    return (
        <div className={styles.anotherMsg}>
            <div className={styles.msgContent}>
                <div className={styles.msgAuthor}>{x.unit.owner}</div>
                <div className={styles.msgText}>{x.unit.text}</div>
                <div className={styles.msgDate}>a</div>
            </div>
        </div>
    )
};

export const MyMessage: React.FC<messageComponentProps> = x => {
    return (
        <div className={styles.myMsg}>
            <div className={styles.msgContent}>
                <div className={styles.msgAuthor}>{x.unit.owner}</div>
                <div className={styles.msgText}>{x.unit.text}</div>
                <div className={styles.msgDate}>b</div>
            </div>
        </div>
    )
};

export const anMessage2: React.FC = () => {
    return (
        <div className={styles.anotherMsg}>
            <div className={styles.msgContent}>
                <div className={styles.msgAuthor}>a</div>
                <div className={styles.msgText}>b</div>
                <div className={styles.msgDate}>c</div>
            </div>
        </div>
    )
};