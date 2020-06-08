import styles from "components/calendar/dayInCalendar.module.css";
import {Card} from "./card";
import React from "react";

export const DayInCalendar: React.FC = () => {

    return (
        <div className={styles.day}>
            <div className={styles.dayHeader}>
                <div className={styles.date}>01.06.20</div>
                <div className={styles.dayOfTheWeek}>пн</div>
            </div>
            <Card/>
            <Card/>
        </div>
    )
};