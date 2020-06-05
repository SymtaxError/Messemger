import React from 'react';
import styles from "components/todo/column.module.css";
import addImg from "img/add.png";
import {ColumnType} from "api/models/todoModel";

interface ColumnProps {
    unit: ColumnType
}

export const Column: React.FC<ColumnProps> = x => {

    return (
        <div className={styles.column}>
            <div className={styles.headOfColumn}>{x.unit.columnTitle}</div>
            <div className={styles.addCard}>
                <img src={addImg} className={styles.addImg} alt={""}/>
            </div>
            <div className={styles.deleteColumn}>Удалить колонку</div>
        </div>
    )
};