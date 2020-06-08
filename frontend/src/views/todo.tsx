import React, {useState} from 'react';
import SignImg from "img/sign.png"
import styles from "views/todo.module.css";
import deletewhiteImg from "img/deletewhite.png";
import {preparedColumns, TodoType} from "api/models/todoModel";
import {TodoList} from "components/todo/todoList";

interface TodoMinProps {
    unit: TodoType
    onClick?: () => void
}

const TodoMiniature: React.FC<TodoMinProps> = x => {
    return (
        <div className={styles.desk1} onClick={x.onClick}>
            <div className={styles.nameOfDesk}>{x.unit.todoTitle}</div>
            <div className={styles.deleteDesk}>
                <img src={deletewhiteImg} className={styles.deletewhiteImg} alt={""}/>
            </div>
        </div>
    )
};

export const Todo: React.FC = () => {

    const [selectedTodo, setSelectedTodo] = useState<TodoType>(preparedColumns[0]);

    return (
        <div className={styles.body}>
            <div className={styles.listOfDesks}>
                {
                    preparedColumns.map((unit, key) =>
                    <TodoMiniature unit={unit}
                                   key={`TodoMiniature-unit-${key}`}
                                   onClick={() => setSelectedTodo(unit)}
                    />)
                }
                <img className={styles.signImg} src={SignImg} alt={""}/>
            </div>

            <div className={styles.other}>
                {
                    selectedTodo
                        ? <TodoList unit={selectedTodo}/>
                        : <div/>
                }
            </div>
        </div>);
};