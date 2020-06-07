import {RegisterUnit} from "./models/register";
import {UserStore} from "../store/user";
import {ChatType} from "./models/chatType";
import {ChatStore, MessageType} from "store/chatListStore";
import {UserUnit} from "./models/user";

export const backendURL = "http://localhost:8000";

const composeArgs = (args: Record<string, string>): string => {
    const entries = Object.entries(args);
    const params = entries.map(entry => `${entry[0]}=${entry[1]}`).join("&");
    return params.length ? `?${params}` : "";
};

interface WrappedResponse<T> {
    body?: T
    code: number
}

interface RefreshUnit {
    access: string
    refresh: string
}

export const resultRefresh = async (): Promise<void> => {
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

const request = async <T>(
    path: string,
    args: Record<string, string>,
    method: "GET" | "POST" | "DELETE" | "PUT",
    body?: string
): Promise<WrappedResponse<T>> => {
    const params = composeArgs(args);
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": (localStorage.getItem("access") !== "undefined")
            ? `JWT ${localStorage.getItem("access")}`
            : ""
    };

    const result = await fetch(
        `${backendURL}${path}${params}`,
        {method: method, headers: headers, body: body, mode: "cors"}
    );

    const status = await result.status;

    if (status === 401) {
        await resultRefresh();
    }

    if (status !== 200)
        return {
            code: status
        };
    return {
        body: JSON.parse(await result.text() || "null") as unknown as T,
        code: status
    };
};


export const http = {
    get: async <T>(path: string, args: Record<string, string>): Promise<WrappedResponse<T>> => {
        return request(path, args, "GET");
    },
    post: async <T>(path: string, args: Record<string, string>, body?: string): Promise<WrappedResponse<T>> => {
        return request(path, args, "POST", body);
    },
    delete: async <T>(path: string, args: Record<string, string>): Promise<WrappedResponse<T>> => {
        return request(path, args, "DELETE");
    },
    put: async <T>(path: string, args: Record<string, string>, body?: string): Promise<WrappedResponse<T>> => {
        return request(path, args, "PUT");
    }
};

export const registerRequest = async (user: RegisterUnit): Promise<number> => {
    const args = {};
    const response = await http.post("/users/register/", args, JSON.stringify(user));
    return response.code;
};

export const loginRequest = async (email: string, password: string): Promise<number> => {
    const args = {};
    const wrappedResponse = await http.post<RefreshUnit>("/auth/jwt/login/", args, JSON.stringify({
        "email": email,
        "password": password
    }));
    if (wrappedResponse.body) {
        localStorage.setItem("access", wrappedResponse.body.access);
        localStorage.setItem("refresh", wrappedResponse.body.refresh);
        await UserStore.getUser();
    }
    return wrappedResponse.code;
};

export const changeUserInfo = async (first_name: string, last_name: string, email: string): Promise<number> => {
    const args = {};
    const response = await http.put("/users/profile/", args, JSON.stringify({first_name: first_name, last_name: last_name, email: email}));
    return response.code;
};

export const createGroupChat = async (name: string, user?: string): Promise<number> => {
    const args = {};
    const response = await http.post("/servers/list/", args, JSON.stringify({name: name, tag: user}));
    return response.code;
};

export const getMessagesRequest = async (id: number): Promise<MessageType[]> => {
    const args = {"chat_id": `${id}`, "count": "20", "start": "1"};
    const response = await http.get("/servers/messages/", args);
    return response.body as unknown as MessageType[]
};

export const getUsersInChatRequest = async (id: number): Promise<UserUnit[]> => {
    const args = {};
    const response = await http.get(`/servers/${id}/members`, args);
    return response.body as unknown as UserUnit[]
};

export const addUsersToChatRequest = async (id: number, body: Record<string, string[]>): Promise<number> => {
    const args={};
    const response = await http.post(`/servers/${id}/members/`, args, JSON.stringify(body));
    return response.code;
};

export const sendNewRequest = async (title: string, text: string): Promise<void> => {
    const args={};
    await http.post(`/news/`, args, JSON.stringify({title: title, text: text}));
    console.log(JSON.stringify({title: title, text: text}));
};