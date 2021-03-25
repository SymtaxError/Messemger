import React from 'react';
import styles from "components/todo/column.module.css";
import addImg from "img/add.png";
import {ColumnType} from "api/models/todoModel";
import {Card} from "./card";

interface ColumnProps {
    unit: ColumnType
}

export const Column: React.FC<ColumnProps> = x => {

    return (
        <div className={styles.column}>
            <div className={styles.headOfColumn}>{x.unit.columnTitle}</div>
            {
                x.unit.cards.length
                    ? x.unit.cards.map((unit, key) => <Card unit={unit} key={`Card-unit-${key}`}/>)
                    : <div>Еще нет карточек</div>
            }
            <div className={styles.addCard}>
                <img src={addImg} className={styles.addImg} alt={""}/>
            </div>
            <div className={styles.deleteColumn}>Удалить столбик</div>
        </div>
    )
};