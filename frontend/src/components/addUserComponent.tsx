import React, {useState} from 'react';
import styles from "components/addUserComponent.module.css"
import {replaceOrPush} from "../utils/misc/arrays";
import plusImg from "img/plus.png"
import minusImg from "img/minus.png"
import {addUsersToChatRequest} from "../api/http";
import {UsersInChatStore} from "../store/UsersInChatStore";

interface AddUserComponentProps {
    endFunction: () => void
    closeFunction: () => void
    chatId?: number
}

interface UserComponentProps {
    unit: string
    onChange: (a: string) => void
}

const UserComponent: React.FC<UserComponentProps> = x => {
    return (
        <input className={styles.userInput} value={x.unit} onChange={a => {
            x.onChange(a.target.value)
        }}/>
    )
};

export const AddUserComponent: React.FC<AddUserComponentProps> = x => {

    const [userList, addUserList] = useState<string[]>([""]);

    return (
        <div className={styles.body}>
            <div className={styles.addUser}>
                <div className={styles.header}>
                    <img src={minusImg}
                         className={styles.oneLessUser}
                         onClick={() => {
                             if (userList.length > 1) {
                                 const a = [...userList];
                                 a.pop();
                                 addUserList(a);
                             }
                         }}/>
                    <div className={styles.headerText} onClick={x.closeFunction}>Добавить участника [x]</div>
                    <img src={plusImg} className={styles.oneMoreUser} onClick={() => addUserList([...userList, ""])}/>
                </div>
                {
                    userList.length
                        ? userList.map((unit, key) => <UserComponent unit={userList[key]}
                                                                     key={key}
                                                                     onChange={(a: string) => addUserList(replaceOrPush(userList, userList[key], a))}/>)
                        : <div/>
                }
                <div className={styles.createButton} onClick={async () => {
                    if (x.chatId) {
                        const responseCode = await addUsersToChatRequest(x.chatId, {tags: userList});
                        if (responseCode !== 201)
                            alert("Неправильно введены данные о пользователе!");
                        else UsersInChatStore.getUsers(x.chatId);
                    }
                }}>
                    Готово
                </div>
            </div>
        </div>
    )
}