import React, {useState} from 'react'
import styles from "views/profile.module.css"
import {UserStore} from "utils/store/user";
import {useMappedStore} from "utils/store";

export const Profile: React.FC = () => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);

    const [userName, setUserName] = useState(user.first_name);
    const [userSurname, setUserSurname] = useState(user.last_name);
    const [userEmail, setUserEmail] = useState(user.email);

    return (
        <div className={styles.body}>
            <div className={styles.profile}>
                <div className={styles.avatarBlock}>
                    <div className={styles.settingsSite}>Your current Avatar</div>
                    <div className={styles.avatarImg}>Avatar image</div>
                    <div>Upload new avatar</div>
                </div>
                <div className={styles.settingsBlock}>
                    <div className={styles.settingsSite}>
                        Основные настройки
                    </div>
                    <div className={styles.settingsMain}>
                        <div className={styles.settingsLabel}>Имя</div>
                        <input className={styles.settingInput}
                               value={userName}
                               onChange={a => setUserName(a.target.value)}/>
                        <div>Фамилия</div>
                        <input className={styles.settingInput}
                               value={userSurname}
                               onChange={a => setUserSurname(a.target.value)}/>
                        <div>Электронная почта</div>
                        <input className={styles.settingInput}
                               value={userEmail}
                               onChange={a => setUserEmail(a.target.value)}/>
                        <button className={styles.exitButton}>Выйти</button>
                    </div>
                </div>
            </div>
        </div>
    )
};