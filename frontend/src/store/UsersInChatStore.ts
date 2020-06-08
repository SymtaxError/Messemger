import {UserUnit} from "api/models/user";
import {createStore, Store, Event, createEvent, createEffect, Effect} from "effector";
import {getUsersInChatRequest} from "../api/http";

interface UsersInChat {
    users: UserUnit[]
}

const initialData: UsersInChat = {
    users: []
};

interface UsersInChatStore extends Store<UsersInChat> {
    setUsers: Event<UserUnit[]>
    getUsers: Effect<number, UserUnit[]>
}

export const UsersInChatStore = (() => {
    const store = createStore<UsersInChat>(initialData) as UsersInChatStore;

    store.setUsers = createEvent<UserUnit[]>("save all users");
    store.on(store.setUsers, ((state, payload) => ({ ...state, users: payload })));

    store.getUsers = createEffect({
        name: "getUser",
        handler: async (id: number): Promise<UserUnit[]> => {
            const response = await getUsersInChatRequest(id);
            return response as unknown as Promise<UserUnit[]>;
        }
    });
    store.getUsers.fail.watch(({ error }) => {
        console.error("Bad credentials", error);
        return;
    });
    store.getUsers.done.watch(result => {
        store.setUsers(result.result);
    });
    return store;
})();