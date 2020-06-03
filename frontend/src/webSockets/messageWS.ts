import {backendURL} from "../api/http";

export const msgSocket = new WebSocket(`ws://localhost:8000/servers/chat/1/?${localStorage.getItem("access")}`);

export const sendTestMessage = (): void => {
    const msg = {
        user: "TestUser",
        action: "chat_message",
        params: {
            "text": "testim-testim",
        },
    };

    msgSocket.send(JSON.stringify(msg));
};

msgSocket.onmessage = (event) => {
    alert(JSON.parse(event.data));
};

export const createChatSocket = (id: number): void => {
    const chatSocket = new WebSocket(`${backendURL}/servers/chat/${id}/?${localStorage.getItem("access")}`);

};

export const sendMessage = (chatSocket: WebSocket, text: string): void => {
    const msg = {
        action: "chat_message",
        params: {
            "text": text
        },
    };

    chatSocket.send(JSON.stringify(msg));
};

