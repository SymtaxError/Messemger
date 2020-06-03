import React, {CSSProperties, ReactNode, useState} from 'react';
import styles from "views/login.module.css";
import {loginRequest, registerRequest} from "api/http"


export const Login: React.FC = () => {
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const setAllZero = () => {
        setPassword("");
        setPasswordCheck("");
        setEmail("");
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
                <div className={styles.signInputText}>Электронная почта</div>
                <input className={styles.signLoginEntry} value={email}
                       onChange={a => setEmail(a.target.value)}
                       style={email === "" ? stylesWrongInput : stylesGoodInput}
                />
                <div className={styles.signInputText}>Пароль</div>
                <input className={styles.signLoginEntry} value={password}
                       onChange={a => setPassword(a.target.value)}
                       style={password === "" ? stylesWrongInput : stylesGoodInput}
                       type={"password"}
                />
                <div className={styles.toRegister} onClick={a => {
                    setIsSignIn(!isSignIn);
                    setAllZero()
                }}>Регистрация
                </div>
                <button className={styles.signButton} onClick={async () =>
                    await loginRequest(email, password)
                }>Войти
                </button>
            </div>
        </div>);

    const registerElement: ReactNode = (
        <div className={styles.sign}>
            <div className={styles.signHeader}>
                <div className={styles.centerText}><strong>Регистрация</strong></div>
            </div>

            <div className={styles.signInputBlock}>
                <div className={styles.signInputText}>Электронная почта</div>
                <input className={styles.signLoginEntry} value={email}
                       onChange={a => setEmail(a.target.value)}
                       style={email === "" ? stylesWrongInput : stylesGoodInput}
                />
                <div className={styles.signInputText}>Имя</div>
                <input className={styles.signLoginEntry} value={name}
                       onChange={a => setName(a.target.value)}
                       style={name === "" ? stylesWrongInput : stylesGoodInput}
                />
                <div className={styles.signInputText}>Фамилия</div>
                <input className={styles.signLoginEntry} value={surname}
                       onChange={a => setSurname(a.target.value)}
                       style={surname === "" ? stylesWrongInput : stylesGoodInput}
                />
                <div className={styles.signInputText}>Пароль</div>
                <input className={styles.signLoginEntry} value={password}
                       onChange={a => setPassword(a.target.value)}
                       style={password === "" ? stylesWrongInput : stylesGoodInput}
                       type={"password"}
                />
                <div className={styles.signInputText}>Повторите пароль</div>
                <input className={styles.signLoginEntry} value={passwordCheck}
                       onChange={a => setPasswordCheck(a.target.value)}
                       style={(passwordCheck !== password || passwordCheck === "") ? stylesWrongInput : stylesGoodInput}
                       type={"password"}
                />

                <div className={styles.toRegister} onClick={a => setIsSignIn(!isSignIn)}>Все-таки хотите войти?</div>
                <button className={styles.signButton} onClick={async () => {
                    await registerRequest({email: email, password: password, first_name: name, last_name: surname});
                }}>Регистрация
                </button>
            </div>
        </div>);
    return (
        <div className={styles.body} style={window.innerWidth < 450 ? stylesSmallWindow : undefined}>
            {isSignIn ? signInElement : registerElement}

            <div className={styles.info}>
                Info about out super mega website of doom
                You need to make a good style for a text like this, huh
                And probably a big text for the Name
            </div>

        </div>);
}