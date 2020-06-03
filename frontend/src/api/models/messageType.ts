import {DateType} from "./dateType";

export interface MessageType {
    owner: string
    owner_tag: string
    text: string
    date_published: DateType
}

export const mockMessageUnits: MessageType[] = [
    {
        owner: "aut1",
        owner_tag: "#aut1",
        text: "testtext1",
        date_published: {day: 30, hour: 30, minute: 30, month: 30, year: 30}
    },
    {
        owner: "aut2",
        owner_tag: "#aut2",
        text: "testtext2",
        date_published: {day: 30, hour: 30, minute: 30, month: 30, year: 30}
    }
];