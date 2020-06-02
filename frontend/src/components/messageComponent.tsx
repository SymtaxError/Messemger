import React, {ReactNode} from 'react';
import styles from "components/chat.module.css"
import {MessageType} from "../api/models/message";

interface messageComponentProps {
    unit: MessageType
}

export const anMessage: React.FC<> = x => {
    return (
        <div className={styles.anotherMsg}>
            <div className={styles.msgContent}>
                <div className={styles.msgAuthor}>Name</div>
                <div className={styles.msgText}>Content{"\n"}Many text So much text Doge </div>
                <div className={styles.msgDate}>99.99.99 2016</div>
            </div>
        </div>
    )
};