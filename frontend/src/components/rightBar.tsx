import React from 'react';
import styles from "components/rightBar.module.css";
import {UserUnit} from "../api/models/user";
import usersImg from "img/users.png"

interface RightBarProps {
    users: UserUnit[]
}

interface RightBarElementProps {
    user: UserUnit
}

const RightBarElement: React.FC<RightBarElementProps> = x => {
    return (
        <div className={styles.user}>
            <div className={styles.name}>{x.user.last_name} {x.user.first_name}</div>
            <div className={styles.tag}>{x.user.tag}</div>
        </div>
    )
};


export const RightBar: React.FC<RightBarProps> = x => {

    return (
        <div className={styles.rightBar}>

            <div className={styles.header}>
                <img src={usersImg} className={styles.usersImg} alt={""}/>
                <div className={styles.members}>{`Участники(${x.users.length})`}</div>
            </div>
            {x.users.map((unit, key) => <RightBarElement user={unit} key={`message-unit-${key}`}/>)}
        </div>
    )
};