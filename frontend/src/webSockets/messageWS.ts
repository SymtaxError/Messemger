import {backendURL} from "../api/http";
//
// export const msgSocket = new WebSocket(`ws://localhost:8000/servers/chat/1/?${localStorage.getItem("access")}`);
//
export const sendWSMessage = (socket: WebSocket, text: string): void => {
    const msg = {
        action: "chat_message",
        params: {
            "text": text,
        },
    };
    socket.send(JSON.stringify(msg));
};
//
// export const sendTestMessage = (): void => {
//     const msg = {
//         user: "TestUser",
//         action: "chat_message",
//         params: {
//             "text": "testim-testim",
//         },
//     };
//
//     msgSocket.send(JSON.stringify(msg));
// };
//
// msgSocket.onmessage = (event) => {
//     alert(JSON.parse(event.data));
// };


