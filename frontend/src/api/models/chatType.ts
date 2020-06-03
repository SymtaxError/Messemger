import {MessageType} from "./messageType";

export interface ChatType {
    id: number
    name: string
    type_chat: "C" | "D"
    picture?: string
    connection: WebSocket
    messages: MessageType[]
}