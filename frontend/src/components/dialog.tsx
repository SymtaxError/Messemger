import React from 'react'
import styles from "components/dialog.module.css"
import arrowImg from "img/arrow.png"

export const Dialog: React.FC = () => {

    return (
        <div className={styles.dialog}>
            <div className={styles.dialogImg}>
                img here
            </div>
            <div className={styles.dialogContent}>
                Name
            </div>
            <img src={arrowImg} className={styles.arrowImg}/>


        </div>
    )
};