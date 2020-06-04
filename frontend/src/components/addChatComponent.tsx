import React, {useState} from 'react';
import styles from "components/addChatComponent.module.css"
import {kStringMaxLength} from "buffer";

export const AddChatComponent: React.FC = () => {

    const [isConference, setIsConference] = useState(true);

    return (
        <div className={styles.body}>
            <div className={styles.createChat}>
                <div className={styles.header}>Создать чат</div>
                <div className={styles.block}>
                    <div>Название чата</div>
                    <div>Ввод названия</div>
                </div>
                <div className={styles.smallBlock}>
                    <div className={styles.choiceOne}>Диалог</div>
                    <div className={styles.wickedOne}>Конференция</div>
                </div>
                <div className={styles.block}>
                    <div>Собеседник</div>
                    <div>Тэг собеседника</div>
                </div>
                <div>Создание</div>
            </div>
        </div>
    )
};