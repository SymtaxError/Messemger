import React from 'react';
import styles from "views/todo.module.css";
import addImg from "img/add.png";
import {TodoType} from "api/models/todoModel";
import {Column} from "./column";

interface TodoListProps {
    unit: TodoType;
}

export const TodoList: React.FC<TodoListProps> = x => {
    return (
        <div>
            <div className={styles.other}>
                <div className={styles.head}>
                    <div className={styles.deskName}>{x.unit.todoTitle}</div>
                    <div className={styles.team}>
                        {/*<div className={styles.teammate}>Ростя</div>*/}
                        {/*<div className={styles.teammate}>Юля</div>*/}
                    </div>
                </div>
                {/*Основное*/}
                <div className={styles.mainPart}>
                    {console.log("render1.5")}
                    {
                        x.unit.columns.map((unit, key) => <Column unit={unit} key={`Column-unit-${key}`}/>)
                    }
                    <div className={styles.addColumn}>
                        Добавить столбик
                        <img src={addImg} className={styles.addImg} alt={""}/>
                    </div>
                </div>
            </div>
        </div>
    )
};