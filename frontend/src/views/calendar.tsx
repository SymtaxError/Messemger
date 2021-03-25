import React from 'react';
import styles from "views/calendar.module.css";
import {DayInCalendar} from "../components/calendar/dayInCalendar";

export const Calendar: React.FC = () => {
    return (
        <div className={styles.body}>
            <div className={styles.leftBar}></div>
            <DayInCalendar/>
            <DayInCalendar/>
            <DayInCalendar/>
            <DayInCalendar/>
            <DayInCalendar/>
            <DayInCalendar/>
            <DayInCalendar/>
        </div>);
};