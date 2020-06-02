import {createStore, Store, Event, createEvent, createEffect, Effect} from "effector";
import {UserUnit} from "api/models/user";

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
            console.log(response);
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
