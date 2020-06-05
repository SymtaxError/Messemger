import React from 'react';
import styles from "components/column.module.css";
import addImg from "img/add.png";

export const RightBar: React.FC = () => {

    return (
        <div className={styles.column}>
            <div className={styles.headOfColumn}>Длинное название столбца</div>


            <div className={styles.addCard}>
                <img src={addImg} className={styles.addImg} alt={""}/>
            </div>
            <div className={styles.deleteColumn}>Удалить колонку</div>
        </div>
    )
};