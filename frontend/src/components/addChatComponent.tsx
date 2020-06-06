import React, {useState} from 'react';
import styles from "components/addChatComponent.module.css"
import {createGroupChat} from "../api/http";
import {ChatStore} from "../store/chatListStore";

interface AddChatComponentProps {
    endFunction: () => void
}

export const AddChatComponent: React.FC<AddChatComponentProps> = x => {

    const [isConference, setIsConference] = useState(false);
    const [chatName, setChatName] = useState("");
    const [dialogTag, setDialogTag] = useState("");

    return (
        <div className={styles.body}>
            <div className={styles.createChat}>
                <div className={styles.header}>Создать чат</div>
                <div className={styles.block}>
                    <div className={styles.blockUp}>Название чата</div>
                    <input className={styles.blockInput}
                           onChange={a => setChatName(a.target.value)}
                    />
                </div>
                <div className={styles.smallBlock}>
                    <div className={isConference ? styles.choiceOne : styles.wickedOne}
                         onClick={() => {
                             if (isConference) setIsConference(!isConference)
                         }}>
                        Диалог
                    </div>
                    <div className={isConference ? styles.wickedOne : styles.choiceOne}
                         onClick={() => {
                             if (!isConference) setIsConference(!isConference)
                         }}>
                        Конференция
                    </div>
                </div>
                {(!isConference)
                    ? (
                        <div className={styles.block}>
                            <div className={styles.blockUp}>Собеседник</div>
                            <input className={styles.blockInput}
                                   onChange={a => setDialogTag(a.target.value)}
                            />
                        </div>
                    )
                    : <div className={styles.block}/>
                }
                <div className={styles.createButton} onClick={async () => {
                    if (chatName) {
                        await createGroupChat(chatName, dialogTag);
                        ChatStore.updateChatList();
                    }
                    x.endFunction();
                    x.endFunction();
                }}
                >Готово
                </div>

            </div>
        </div>
    )
};