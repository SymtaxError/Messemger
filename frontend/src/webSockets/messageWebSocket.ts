export const msgSocket = new WebSocket(`ws://localhost:8000/servers/chat/1/?${localStorage.getItem("access")}`);

export const sendTestMessage = () => {
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
    alert(event.data);
};