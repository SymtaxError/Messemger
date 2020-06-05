import React from 'react';

import styles from "views/todo.module.css";
import plusImg from "img/plus.png";
import doneImg from "img/done.png";
import notdoneImg from "img/notdone.png";
import deleteImg from "img/delete.png";
import deletewhiteImg from "img/deletewhite.png";
import addImg from "img/add.png";
import {Column} from "../components/column";
import {Card} from "../components/card";


export const Todo: React.FC = () => {

    return (
        <div className={styles.body}>
            <div className={styles.listOfDesks}>
                <div className={styles.desk1}>
                    <div className={styles.nameOfDesk}>ФРОНТ РАБОТАЕТ</div>
                    <div className={styles.deleteDesk}>
                        <img src={deletewhiteImg} className={styles.deletewhiteImg}/>
                    </div>
                </div>
                <div className={styles.desk1}>
                    <div className={styles.nameOfDesk}>блааблабла</div>
                    <div className={styles.deleteDesk}>
                        <img src={deletewhiteImg} className={styles.deletewhiteImg}/>
                    </div>
                </div>
                <div className={styles.desk1}>
                    <img src={plusImg} className={styles.plusImg}/>
                </div>
            </div>
            <div className={styles.other}>
                <div className={styles.head}>
                    <div className={styles.deskName}>Фронт работает</div>
                    <div className={styles.team}>
                        <div className={styles.teammate}>Ростя</div>
                        <div className={styles.teammate}>Юля</div>
                    </div>
                </div>
                <div className={styles.mainPart}>
                    <Column/><Card/>/
                    <div className={styles.addColumn}>
                        Добавить карточку
                        <img src={addImg} className={styles.addImg} alt={""}/>
                    </div>
                </div>
            </div>
        </div>);
}