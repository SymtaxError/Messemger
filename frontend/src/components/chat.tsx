import React, {ReactNode} from 'react';
import styles from "components/chat.module.css"
import menuImg from "img/tripleMenu.png"
export const Chat: React.FC = () => {

    const anMessage: ReactNode = (
        <div className={styles.anotherMsg}>
            <div className={styles.msgContent}>
                <div className={styles.msgAuthor}>Name</div>
                <div className={styles.msgText}>Content{"\n"}Many text So much text Doge </div>
                <div className={styles.msgDate}>99.99.99 2016</div>
            </div>
        </div>
    );

    const myMessage: ReactNode = (
        <div className={styles.myMsg}>
            <div className={styles.msgContent}>
                <div className={styles.msgAuthor}>myName</div>
                <div className={styles.msgText}>myContent{"\n"}Many text So much text my Doge </div>
                <div className={styles.msgDate}>00.00.00 2016</div>
            </div>
        </div>
    );

    return (
        <div className={styles.chat}>
            <div className={styles.header}>
                <div className={styles.headerName}>
                    Name
                </div>
                <img src={menuImg} className={styles.headerImg}/>
            </div>
            <div className={styles.content}>
                {anMessage}
                {myMessage}
                {anMessage}
                {myMessage}
                {myMessage}
                {myMessage}
                {anMessage}
                {myMessage}
            </div>
            <div className={styles.enter}>
                <textarea className={styles.sendArea} placeholder ="Type your message"/>
                <button className={styles.sendButton}>Отправить</button>
            </div>
        </div>
    )
};