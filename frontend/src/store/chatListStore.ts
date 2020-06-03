import {createStore, Store, Event, createEvent, Effect, createEffect} from "effector";
import {ChatType} from "api/models/chatType";
import {getChatList} from "api/http";
import {DateType} from "../api/models/dateType";
import {replaceOrPush} from "utils/misc/arrays";

interface ChatListStore {
    chats: ChatType[]
}

const initialData: ChatListStore = {
    chats: []
};

interface ChatInit {
    id: number
    token: string
    onMessage: (a: MessageEvent) => void

    name: string
    type_chat: "C" | "D"
    picture?: string
}

interface MessageType {
    owner: string
    // owner_tag: string
    message: string
    // date_published: DateType
    id: number
}

interface ChatStore extends Store<ChatListStore> {
    setChats: Event<ChatType[]>
    addChat: Event<ChatType>
    addMessage: Event<MessageType>
    updateChatList: Effect<void, ChatType[]>
    createChat: Effect<ChatInit, ChatType>
}

export const ChatStore = (() => {
    const store = createStore<ChatListStore>(initialData) as ChatStore;

    store.setChats = createEvent<ChatType[]>("set chats");
    store.on(store.setChats, ((state, payload) => ({...state, chats: payload})));

    store.addChat = createEvent<ChatType>("add single chat");
    store.on(store.addChat, ((state, payload) => ({...state, chats: [...state.chats, payload]})));

    store.addMessage = createEvent<MessageType>("push message to chat");
    store.on(store.addMessage, ((state, payload) => {
        const chat = state.chats.find(a => a.id === payload.id);
        if (!chat)
            return state;
        const editedChat = {...chat, messages: [...chat.messages, payload]} as ChatType;
        return ({...state, chats: replaceOrPush<ChatType>(state.chats, chat, editedChat)});
    }));

    store.createChat = createEffect({
        name: "create chat",
        handler: (a: ChatInit): ChatType => {
            const connection = new WebSocket(`ws://localhost:8000/servers/chat/${a.id}/?token${a.token}`);
            connection.onmessage = a.onMessage

            return {
                ...a,
                connection: connection,
                messages: []
            };
        }
    });

    store.createChat.done.watch(a => store.addChat(a.result));

    store.updateChatList = createEffect({
        name: "getChatList",
        handler: async (): Promise<ChatType[]> => {
            const response = await getChatList();
            return response;
        }
    });
    store.updateChatList.fail.watch(({error}) => {
        console.error("Bad credentials", error);
        return;
    });
    store.updateChatList.done.watch(result => {
        const token = localStorage.getItem("access");
        if (token) {
            result.result.forEach(a => store.createChat({
                ...a,
                token: token,
                onMessage: a => store.addMessage(JSON.parse(a.data) as unknown as MessageType)
            }));
        }

        console.log("yay chats");
        console.log(result);
    });

    store.updateChatList();
    return store;
})();