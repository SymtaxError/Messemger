import {createStore, Store, Event, createEvent, Effect, createEffect} from "effector";
import {ChatType} from "api/models/chatType";
import {getChatList, http} from "api/http";

interface ChatListStore {
    chats: ChatType[]
}

const initialData: ChatListStore = {
    chats: []
};

interface ChatStore extends Store<ChatListStore> {
    setChats: Event<ChatType[]>
    updateChatList: Effect<void, ChatType[]>
}

export const ChatStore = (() => {
    const store = createStore<ChatListStore>(initialData) as ChatStore;

    store.setChats = createEvent<ChatType[]>("set chats");
    store.on(store.setChats, ((state, payload) => ({...state, chats: payload})));

    store.updateChatList = createEffect({
        name: "getChatList",
        handler: async (): Promise<ChatType[]> => {
            const response = await getChatList();
            return response;
        }
    });
    store.updateChatList.fail.watch(({ error }) => {
        console.error("Bad credentials", error);
        return;
    });
    store.updateChatList.done.watch(result => {
        store.setChats(result.result);
        console.log("yay chats");
        console.log(result);
    });

    store.updateChatList();
    return store;
})();