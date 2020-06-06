import React from 'react';
import styles from "components/rightBar.module.css";
import {UserUnit} from "../api/models/user";

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

    return (
        <div className={styles.rightBar}>
            {x.users.map((unit, key) => <RightBarElement user={unit} key={`message-unit-${key}`}/>)}
        </div>
    )
};