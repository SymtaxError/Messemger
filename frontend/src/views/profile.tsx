import React from 'react'
import styles from "views/profile.module.css"

export const Profile: React.FC = () => {
    return(
    <div className={styles.body}>
        <div className={styles.profile}>
            <div className={styles.avatarBlock}>
                <div className={styles.avatarSign}>Your current Avatar</div>
                <div className={styles.avatarImg}>Avatar image</div>
                <div>Upload new avatar</div>
            </div>
            <div>asdddddddddsadsadsasadasdasdasdadasdasdasdasdasdasd</div>
        </div>
    </div>
    )
};