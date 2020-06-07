import {createStore, Store, Event, createEvent, createEffect, Effect} from "effector";
import {UserUnit} from "api/models/user";
import {backendURL} from "../api/http";

interface RefreshUnit {
    access: string
    refresh: string
}

const resultRefresh = async (): Promise<void> => {
    const bodyForCheck = {
        "refresh": (localStorage.getItem("refresh") !== "undefined")
            ? `${localStorage.getItem("refresh")}`
            : ""
    };
    const headers = {
        "Content-Type": "application/json; charset=UTF-8"
    };
    const response = await fetch(
        `${backendURL}/auth/jwt/refresh/`, // Сюда адрес для проверки временного токена
        {method: "POST", body: JSON.stringify(bodyForCheck), mode: "cors", headers: headers}
    );
    const state = response.status;
    const result: RefreshUnit = JSON.parse(await response.text());
    if (state === 200) {
        localStorage.setItem("access", result.access);
        localStorage.setItem("refresh", result.refresh);
        await UserStore.getUser()

    } else {
        console.log("want redirect");
        // window.location.replace("localhost:3000/login");
    }
    return;
};

export const userDataRequest = async (): Promise<UserUnit> => {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": (localStorage.getItem("access") !== "undefined")
            ? `JWT ${localStorage.getItem("access")}`
            : ""
    };
    const response = await fetch(
        `http://localhost:8000/users/profile/`,
        {method: "GET", headers: headers, mode: "cors"}
    );
    if (response.status === 401)
        await resultRefresh();
    return JSON.parse(await response.text()) as unknown as UserUnit;
};

interface UserData {
    user: UserUnit
}

const initialData: UserData = {
    user: {email: "", first_name: "", last_name: "", tag: ""}
};

interface UserStore extends Store<UserData> {
    setUser: Event<UserUnit>
    getUser: Effect<void, UserUnit>
}

export const UserStore = (() => {
    const store = createStore<UserData>(initialData) as UserStore;

    store.setUser = createEvent<UserUnit>("email set");
    store.on(store.setUser, ((state, payload) => ({ ...state, user: payload })));

    store.getUser = createEffect({
        name: "getUser",
        handler: async (): Promise<UserUnit> => {
            const response = await userDataRequest();
            return response;
        }
    });
    store.getUser.fail.watch(({ error }) => {
        console.error("Bad credentials", error);
        return;
    });
    store.getUser.done.watch(result => {
        store.setUser(result.result);
    });

    store.getUser();
    return store;
})();
