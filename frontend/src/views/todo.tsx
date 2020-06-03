import React from 'react';

import styles from "views/todo.module.css";
import plusImg from "img/plus.png";
import doneImg from "img/done.png";
import notdoneImg from "img/notdone.png";
import deleteImg from "img/delete.png";
import addImg from "img/add.png";


export const Todo: React.FC = () => {

    return (
        <div className={styles.body}>
            <div className={styles.listOfLists}>
                <div className={styles.list1}>
                    <div className={styles.nameOfList}>ФРОНТ РАБОТАЕТ</div>
                </div>
                <div className={styles.list1}>
                    <div className={styles.nameOfList}>блааблабла</div>
                </div>
                <div className={styles.list1}>
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
                    <div className={styles.card}>
                        <div className={styles.headOfCard}>Длинное название карточки</div>
                        <div className={styles.point}>
                            <div className={styles.done}>
                                <img src={doneImg} className={styles.doneImg} alt={""}/>
                            </div>
                            <div className={styles.task}>Задача 1</div>
                            <div className={styles.delete}>
                                <img src={deleteImg} className={styles.deleteImg} alt={""}/>
                            </div>
                        </div>
                        <div className={styles.point}>
                            <div className={styles.done}>
                                <img src={doneImg} className={styles.doneImg} alt={""}/>
                            </div>
                            <div className={styles.task}>Задача 2</div>
                            <div className={styles.delete}>
                                <img src={deleteImg} className={styles.deleteImg} alt={""}/>
                            </div>
                        </div>
                        <div className={styles.point}>
                            <div className={styles.notDone}>
                                <img src={notdoneImg} className={styles.notdoneImg} alt={""}/>
                            </div>
                            <div className={styles.task}>Задача 3</div>
                            <div className={styles.delete}>
                                <img src={deleteImg} className={styles.deleteImg} alt={""}/>
                            </div>
                        </div>
                        <div className={styles.addPoint}>
                            <img src={addImg} className={styles.addImg} alt={""}/>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.headOfCard}>Обычное название</div>
                        <div className={styles.point}>
                            <div className={styles.notDone}>
                                <img src={notdoneImg} className={styles.notdoneImg} alt={""}/>
                            </div>
                            <div className={styles.task}>Задача 1.1</div>
                            <div className={styles.delete}>
                                <img src={deleteImg} className={styles.deleteImg} alt={""}/>
                            </div>
                        </div>
                        <div className={styles.addPoint}>
                            <img src={addImg} className={styles.addImg} alt={""}/>
                        </div>
                    </div>
                    <div className={styles.addCard}>
                        Добавить карточку
                        <img src={addImg} className={styles.addImg} alt={""}/>
                    </div>
                </div>
            </div>
        </div>);
}