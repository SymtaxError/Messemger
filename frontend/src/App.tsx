import React, {CSSProperties, ReactNode, useState} from 'react';
import './App.css';
import styles from "./App.module.css";
import {http} from "src/api/http";

export const App = () => {

    const [Login, setLogin] = useState("");
    const [Password, setPassword] = useState("");
    const [PasswordCheck, setPasswordCheck] = useState("");
    const [isSignIn, setIsSignIn] = useState(true);
    const [Mail, setMail] = useState("");
    const [Name, setName] = useState("");
    const [Surname, setSurname] = useState("");

    const setAllZero = () => {
        // setLogin("");
        setPassword("");
        setPasswordCheck("");
        setMail("");
        setName("");
        setSurname("");
    };

    const stylesWrongInput: CSSProperties = {
        border: "1px solid #ff8475"
    };

    const stylesGoodInput: CSSProperties = {
        backgroundColor: "#F4F0F6"
    };

    const stylesSmallWindow: CSSProperties = {
        paddingTop: "0px"
    };

    const signInElement: ReactNode = (
        <div className={styles.sign}>
            <div className={styles.signHeader}>
                <div className={styles.centerText}><strong>Вход</strong></div>
            </div>

            <div className={styles.signInputBlock}>
                <div className={styles.signInputText}>Логин/Почта</div>
                <input className={styles.signLoginEntry} value={Login}
                       onChange={a => setLogin(a.target.value)}
                       style={Login === "" ? stylesWrongInput : stylesGoodInput}
                />
                <div className={styles.signInputText}>Пароль</div>
                <input className={styles.signLoginEntry} value={Password}
                       onChange={a => setPassword(a.target.value)}
                       style={Password === "" ? stylesWrongInput : stylesGoodInput}
                       type={"password"}
                />
                <div className={styles.toRegister} onClick={a => {
                    setIsSignIn(!isSignIn);
                    setAllZero()
                }}>Регистрация
                </div>
                <button className={styles.signButton}>Войти</button>
            </div>
        </div>);

    const registerElement: ReactNode = (
        <div className={styles.sign}>
            <div className={styles.signHeader}>
                <div className={styles.centerText}><strong>Регистрация</strong></div>
            </div>

            <div className={styles.signInputBlock}>
                <div className={styles.signInputText}>Логин</div>
                <input className={styles.signLoginEntry} value={Login}
                       onChange={a => setLogin(a.target.value)}
                       style={Login === "" ? stylesWrongInput : stylesGoodInput}
                />
                <div className={styles.signInputText}>Электронная почта</div>
                <input className={styles.signLoginEntry} value={Mail}
                       onChange={a => setMail(a.target.value)}
                       style={Mail === "" ? stylesWrongInput : stylesGoodInput}
                />
                <div className={styles.signInputText}>Имя</div>
                <input className={styles.signLoginEntry} value={Name}
                       onChange={a => setName(a.target.value)}
                       style={Name === "" ? stylesWrongInput : stylesGoodInput}
                />
                <div className={styles.signInputText}>Фамилия</div>
                <input className={styles.signLoginEntry} value={Surname}
                       onChange={a => setSurname(a.target.value)}
                       style={Surname === "" ? stylesWrongInput : stylesGoodInput}
                />
                <div className={styles.signInputText}>Пароль</div>
                <input className={styles.signLoginEntry} value={Password}
                       onChange={a => setPassword(a.target.value)}
                       style={Password === "" ? stylesWrongInput : stylesGoodInput}
                       type={"password"}
                />
                <div className={styles.signInputText}>Повторите пароль</div>
                <input className={styles.signLoginEntry} value={PasswordCheck}
                       onChange={a => setPasswordCheck(a.target.value)}
                       style={(PasswordCheck !== Password || PasswordCheck === "") ? stylesWrongInput : stylesGoodInput}
                       type={"password"}
                />

                <div className={styles.toRegister} onClick={a => setIsSignIn(!isSignIn)}>Все-таки хотите войти?</div>
                <button className={styles.signButton}>Регистрация</button>
            </div>
        </div>);

    return (
        <div>
            <div className={styles.header}></div>
            <div className={styles.body} style={window.innerWidth < 450 ? stylesSmallWindow : undefined}>

                {isSignIn ? signInElement : registerElement}

                <div className={styles.info}>
                    Info about out super mega website of doom
                    You need to make a good style for a text like this, huh
                    And probably a big text for the Name
                </div>


            </div>
        </div>
    );
}
