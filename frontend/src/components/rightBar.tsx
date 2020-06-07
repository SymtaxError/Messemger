import React from 'react';
import styles from "components/rightBar.module.css";
import {UserUnit} from "../api/models/user";
import usersImg from "img/users.png"
import plusImg from "img/plus.png";
import {User} from "../components/user";

interface RightBarProps {
    users: UserUnit[]
}

interface RightBarElementProps {
    user: UserUnit
}

const RightBarElement: React.FC<RightBarElementProps> = x => {
    return (
        <div className={styles.RightBarElement}>
            <div className={styles.userData}>{x.user.first_name} {x.user.last_name}</div>
            <div className={styles.userData}>{x.user.tag}</div>
        </div>
    )
};


export const RightBar: React.FC<RightBarProps> = x => {

    const count = 4;
    return (
        <div className={styles.rightBar}>
            {x.users.map((unit, key) => <RightBarElement user={unit} key={`message-unit-${key}`}/>)}
            <div className={styles.header}>
                <img src={usersImg} className={styles.usersImg} alt={""}/>
                <div className={styles.members}>{`Участники(${count})`}</div>
                <img src={plusImg} className={styles.plusImg} alt={""}/>
            </div>
            <User/>
        </div>
    )
};