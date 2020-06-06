import {createEffect, createEvent, createStore, Effect, Event, Store} from "effector";
import {ChatType} from "api/models/chatType";
import {backendURL, getMessagesRequest, http} from "api/http";
import {replaceOrPush} from "utils/misc/arrays";
import {UserStore} from "./user";

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

export const getChatList = async (): Promise<ChatType[]> => {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": (localStorage.getItem("access") !== "undefined")
            ? `JWT ${localStorage.getItem("access")}`
            : ""
    };
    const response = await fetch(
        "http://localhost:8000/servers/list/",
        {method: "GET", headers: headers, mode: "cors"}
    );
    if (response.status === 401) {
        await resultRefresh();
    }
    return JSON.parse(await response.text()) as unknown as ChatType[];
};

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

interface MessageContent {
    text: string
    owner_tag: string
    chat_id: number
}

export interface MessageType {
    owner: string
    params: MessageContent
}

interface ChatStore extends Store<ChatListStore> {
    setChats: Event<ChatType[]>
    addChat: Event<ChatType>
    addMessage: Event<MessageType>
    setMessages: Event<MessageType[]>
    updateChatList: Effect<void, ChatType[]>
    createChat: Effect<ChatInit, ChatType>
    getMessagesForChat: Effect<number, MessageType[]>
    clearChatList: Event<void>
    clearChatMessages: Event<number>
}

export const ChatStore = (() => {
    const store = createStore<ChatListStore>(initialData) as ChatStore;

    store.setChats = createEvent<ChatType[]>("set chats");
    store.on(store.setChats, ((state, payload) => ({...state, chats: payload})));

    store.addChat = createEvent<ChatType>("add single chat");
    store.on(store.addChat, ((state, payload) => ({...state, chats: [...state.chats, payload]})));

    store.clearChatList = createEvent<void>("add single chat");
    store.on(store.clearChatList, ((state) => ({...state, chats: []})));

    store.clearChatMessages =  createEvent<number>("clear messages from one chat");
    store.on(store.clearChatMessages, ((state, payload) => {
        const chat = state.chats.find(a => a.id === payload);
        const editedChat = {...chat, messages: []} as ChatType;
        return({...state, chats: replaceOrPush<ChatType>(state.chats, chat, editedChat)})
    }));

    store.addMessage = createEvent<MessageType>("push message to chat");
    store.on(store.addMessage, ((state, payload) => {
        const chat = state.chats.find(a => a.id === payload.params.chat_id);
        if (!chat)
            return state;
        const editedChat = {...chat, messages: [...chat.messages, payload]} as ChatType;
        return ({...state, chats: replaceOrPush<ChatType>(state.chats, chat, editedChat)});
    }));

    store.createChat = createEffect({
        name: "create chat",
        handler: (a: ChatInit): ChatType => {
            const connection = new WebSocket(`ws://localhost:8000/chat/${a.id}/?token=${a.token}`);
            connection.onmessage = a.onMessage;

            return {
                ...a,
                connection: connection,
                messages: []
            };
        }
    });
    store.createChat.done.watch(a => store.addChat(a.result));

    store.getMessagesForChat = createEffect({
        name: "get messages for chat by id",
        handler: async (id: number): Promise<MessageType[]> => {
            store.clearChatMessages(id);
            const response = await getMessagesRequest(id);
            // if (response?.length)
            //     return response;
            return response;
        }
    });
    store.getMessagesForChat.done.watch(a => {
        console.log("store updated with new messages", a.result);
        a.result.forEach(a => store.addMessage(a))
    });

    store.updateChatList = createEffect({
        name: "update chat list",
        handler: async (): Promise<ChatType[]> => {
            return await getChatList();
        }
    });
    store.updateChatList.fail.watch(({error}) => {
        console.error("Bad credentials", error);
        return;
    });
    store.updateChatList.done.watch(result => {
        const token = localStorage.getItem("access");
        if (token) {
            store.clearChatList();
            result.result.forEach(a => store.createChat({
                ...a,
                token: token,
                onMessage: a => {
                    const buf: MessageType = JSON.parse(a.data);
                    const temp = {
                        owner: buf.owner,
                        params: {
                            text: buf.params.text,
                            chat_id: buf.params.chat_id,
                            owner_tag: buf.params.owner_tag
                        }
                    };
                    // Попробуем вернуть temp, если все-таки не парсится нормально, ага?
                    console.log(buf);
                    store.addMessage(buf)
                }
            }));
        }
    });

    store.updateChatList();
    return store;
})();