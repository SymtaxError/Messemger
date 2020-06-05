import {createEffect, createEvent, createStore, Effect, Event, Store} from "effector";
import {ChatType} from "api/models/chatType";
import {getMessagesRequest, http} from "api/http";
import {replaceOrPush} from "utils/misc/arrays";

export const getChatList2 = async (): Promise<ChatType[]> => {
    const args = {};
    const response = await http.get("/servers/list/", args);
    return response.body as unknown as ChatType[]
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
    user: string
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
}

export const ChatStore = (() => {
    const store = createStore<ChatListStore>(initialData) as ChatStore;

    store.setChats = createEvent<ChatType[]>("set chats");
    store.on(store.setChats, ((state, payload) => ({...state, chats: payload})));

    store.addChat = createEvent<ChatType>("add single chat");
    store.on(store.addChat, ((state, payload) => ({...state, chats: [...state.chats, payload]})));

    store.clearChatList = createEvent<void>("add single chat");
    store.on(store.clearChatList, ((state) => ({...state, chats: []})));

    store.setMessages = createEvent<MessageType[]>("put messages by request onclick");
    store.on(store.setMessages, ((state, payload) => {
        if (!payload?.length)
            return state;
        const chat = state.chats.find(a => a.id === payload[0].params.chat_id);
        const editedChat = {...chat, messages: []} as ChatType; // Стираю все
        payload.forEach(a => store.addMessage(a));
        return ({...state, chats: replaceOrPush<ChatType>(state.chats, chat, editedChat)});
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
            const response = await getMessagesRequest(id);
            if (response?.length)
                return response;
            else throw Error("error geting mesages");
        }
    });
    store.getMessagesForChat.done.watch(a => {
        console.log("store updated with new messages", a.result);
        store.setMessages(a.result);
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
                        user: buf.user,
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