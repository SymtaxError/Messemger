import {createStore, Store, Event, createEvent, createEffect, Effect} from "effector";
import {userDataRequest} from "../../api/http";
import {UserUnit} from "../../api/models/user";

interface UserData {
    user: UserUnit
}

const initialData: UserData = {
    user: {email: "", first_name: "", last_name: ""}
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
        console.log("yay user!");
    });

    store.getUser();
    return store;
})();