import {createEffect, createEvent, createStore, Effect, Event, Store} from "effector";
import {ChatType} from "api/models/chatType";
import {getChatList} from "api/http";
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
    getMessages: Event<MessageType[]>
    updateChatList: Effect<void, ChatType[]>
    createChat: Effect<ChatInit, ChatType>
}

export const ChatStore = (() => {
    const store = createStore<ChatListStore>(initialData) as ChatStore;

    store.setChats = createEvent<ChatType[]>("set chats");
    store.on(store.setChats, ((state, payload) => ({...state, chats: payload})));

    store.addChat = createEvent<ChatType>("add single chat");
    store.on(store.addChat, ((state, payload) => ({...state, chats: [...state.chats, payload]})));

    store.getMessages = createEvent<MessageType[]>("put messages by request onclick");
    store.on(store.getMessages, ((state, payload) => {
        if (!payload)
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

        console.log("yay chats");
        console.log(result);
    });

    store.updateChatList();
    return store;
})();