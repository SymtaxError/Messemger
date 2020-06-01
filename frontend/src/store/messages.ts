import {createStore, Store, Event, createEvent, createEffect, Effect} from "effector";
import {MessageType} from "api/models/message";

interface MessagesData {
    name: string
    messages: MessageType[]
}

const initialData: MessagesData = {
    name: "",
    messages: []
};

interface MessagesStore extends Store<MessagesData> {
    setName: Event<string>
    setMessages: Event<MessageType[]>
    getMessagesData: Effect<void, MessagesData>
}

export const MessagesStore = (() => {
    const store = createStore<MessagesData>(initialData) as MessagesStore;

    store.setName = createEvent<string>("Name set");
    store.on(store.setName, ((state, payload) => ({ ...state, name: payload })));

    store.setMessages = createEvent<MessageType[]>("Messages list set");
    store.on(store.setMessages, ((state, payload) => ({ ...state, messages: payload })));

    // store.getMessagesData = createEffect({
    //     name: "getUser",
    //     handler: async (): Promise<UserUnit> => {
    //         const response = await userDataRequest();
    //         return response;
    //     }
    // });
    // store.getUser.fail.watch(({ error }) => {
    //     console.error("Bad credentials", error);
    //     return;
    // });
    // store.getUser.done.watch(result => {
    //     store.setUser(result.result);
    // });
    //
    // store.getUser();
    return store;
})();
