import {DateType} from "./date";

export interface MessageType {
    author: string
    text: string
    date_published: DateType
}