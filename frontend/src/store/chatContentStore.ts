import {createStore, Store, Event, createEvent, Effect, createEffect} from "effector";
import {ChatType} from "api/models/chatType";
import {getChatList, getMessagesRequest} from "api/http";
import {MessageType} from "../api/models/messageType";

interface ChatContentStore {
    content: MessageType[]
}

const initialData: ChatContentStore = {
    content: []
};

interface MessagesStore extends Store<ChatContentStore> {
    setMessages: Event<MessageType[]>
    addMessage: Event<MessageType>
    getMessages: Effect<number, MessageType[]>
}

export const MessagesStore = (() => {
    const store = createStore<ChatContentStore>(initialData) as MessagesStore;

    store.setMessages = createEvent<MessageType[]>("set messages");
    store.on(store.setMessages, ((state, payload) => ({...state, content: payload})));

    store.addMessage = createEvent<MessageType>("add message");
    store.on(store.addMessage, ((state, payload) => ({...state, content:[...state.content, payload]})));

    store.getMessages = createEffect({
        name: "getChatList",
        handler: async (id: number): Promise<MessageType[]> => {
            const response = await getMessagesRequest(id);
            return response;
        }
    });
    store.getMessages.fail.watch(({ error }) => {
        console.error("Bad credentials", error);
        return;
    });
    store.getMessages.done.watch(result => {
        store.setMessages(result.result);
        console.log("yay messages");
        console.log(result);
    });

    return store;
})();