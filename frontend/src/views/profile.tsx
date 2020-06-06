import React, {useState} from 'react'
import styles from "views/profile.module.css"
import {UserStore} from "store/user";
import {useMappedStore} from "utils/store";
import {useHistory} from "react-router";

export const Profile: React.FC = () => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);

    const [userName, setUserName] = useState(user.first_name);
    const [userSurname, setUserSurname] = useState(user.last_name);
    const [userEmail, setUserEmail] = useState(user.email);
    const [userTag, setUserTag] = useState(user.tag);

    const history = useHistory();

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
                        <div>Тэг пользователя</div>
                        <input className={styles.settingInput}
                               value={userTag}
                               onChange={a => setUserTag(a.target.value)}/>
                        <button className={styles.changeButton} onClick={() => {
                            alert ("В будущих версиях :)")
                        }}>Изменить данные</button>
                        <button className={styles.exitButton} onClick={() => {
                            UserStore.setUser({tag: "", first_name: "", email: "",last_name: "" });
                            localStorage.setItem("access", "");
                            localStorage.setItem("refresh", "");
                            history.push("/login");
                        }}>Выйти</button>
                    </div>
                </div>
            </div>
        </div>
    )
};