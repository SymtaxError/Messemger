import React, {useEffect, useState} from 'react'
import styles from "views/profile.module.css"
import {UserStore} from "store/user";
import {useMappedStore} from "utils/store";
import {useHistory} from "react-router";
import {changeUserInfo} from "../api/http";
import {UserUnit} from "../api/models/user";

interface SettingsProps {
    unit: UserUnit
}

export const Profile: React.FC = () => {

    const [
        user
    ] = useMappedStore(UserStore, x => [
        x.user
    ]);

    const history = useHistory();

    const [userName, setUserName] = useState(user.first_name);
    const [userSurname, setUserSurname] = useState(user.last_name);
    const [userEmail, setUserEmail] = useState(user.email);
    const [userTag, setUserTag] = useState(user.tag);

    useEffect(() => {
        setUserName(user.first_name);
        setUserSurname(user.last_name);
        setUserEmail(user.email);
        setUserTag(user.tag);
    }, [user]);

    return (
        <div className={styles.body}>
            <div className={styles.profile}>
                <div className={styles.settingsBlock}>
                    <div className={styles.settingsSite}>
                        <div>Основные настройки</div>
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
                               onChange={a => setUserTag(a.target.value)} disabled/>
                        <button className={styles.changeButton} onClick={async () => {
                            const response = await changeUserInfo(userName, userSurname, userEmail);
                            if (response === 200)
                                alert("Данные изменены!");
                            else
                                alert("Упс! Что-то пошло не так :( \n Проверьте данные.")
                        }}>
                            Изменить данные
                        </button>
                        <button className={styles.exitButton} onClick={() => {
                            UserStore.setUser({tag: "", first_name: "", email: "", last_name: "", is_superuser: false});
                            localStorage.setItem("access", "");
                            localStorage.setItem("refresh", "");
                            history.push("/login");
                        }}>Выйти
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};