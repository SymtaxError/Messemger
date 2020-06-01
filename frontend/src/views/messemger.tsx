import React from 'react'
import styles from "views/messemger.module.css"
import {Dialog} from "components/dialog"
import {Chat} from "components/chat"
import {RightBar} from "../components/rightBar";

export const Messemger: React.FC = () => {

    return (
        <div className={styles.body}>
            <div className={styles.leftBarOpen}>
                <Dialog/>
                <Dialog/>
                <Dialog/>
                <Dialog/>
            </div>
            <Chat/>
            <div className={styles.rightBar}>
                <RightBar/>
            </div>
        </div>
    )
};