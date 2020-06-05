import {MessageType} from "store/chatListStore";

export interface ChatType {
    id: number
    name: string
    type_chat: "C" | "D"
    picture?: string
    connection: WebSocket
    messages: MessageType[]
}