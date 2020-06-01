import {UserUnit} from "./models/user";
import {RegisterUnit} from "./models/register";
import {UserStore} from "../utils/store/user";


export const backendURL = "http://localhost:8000";

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
    const response = await fetch(
        `${backendURL}/auth/jwt/refresh/`, // Сюда адрес для проверки временного токена
        {method: "POST", body: JSON.stringify(bodyForCheck), mode: "cors"}
    );
    const state = response.status;
    const result: RefreshUnit = JSON.parse(await response.text());
    if (state === 200) {
        localStorage.setItem("access", result.access);
        localStorage.setItem("refresh", result.refresh);
    } else if (state === 401) {
        window.location.replace("localhost:3000/login")
    }
    return;
};

const request = async <T>(
    path: string,
    method: "GET" | "POST" | "DELETE",
    body?: string
): Promise<WrappedResponse<T>> => {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": (localStorage.getItem("access") !== "undefined")
            ? `JWT ${localStorage.getItem("access")}`
            : ""
    };

    const result = await fetch(
        `${backendURL}${path}`,
        {method: method, headers: headers, body: body, mode: "cors"}
    );

    const status = await result.status;

    if (status === 403) {
        await resultRefresh();
    } else if (result.status === 401) {
        alert("Ошибка 401");
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
        return request(path, "GET");
    },
    post: async <T>(path: string, args: Record<string, string>, body?: string): Promise<WrappedResponse<T>> => {
        return request(path, "POST", body);
    },
    delete: async <T>(path: string, args: Record<string, string>): Promise<WrappedResponse<T>> => {
        return request(path, "DELETE");
    }
};

export const registerRequest = async (user: RegisterUnit): Promise<void> => {
    const args = {};
    await http.post("/users/register/", args, JSON.stringify(user));
    return;
};

export const loginRequest = async (email: string, password: string): Promise<void> => {
    const args = {};
    const wrappedResponse = await http.post<RefreshUnit>("/auth/jwt/login/", args, JSON.stringify({
        "email": email,
        "password": password
    }));
    if (wrappedResponse.body) {
        localStorage.setItem("access", wrappedResponse.body.access);
        localStorage.setItem("refresh", wrappedResponse.body.refresh);
        await UserStore.getUser();
    } else
        alert("Неправильный логин/пароль");
    return;
};

export const userDataRequest = async (): Promise<UserUnit> => {
    const args = {};
    const response = await http.get("/users/profile/", args);
    return response.body as unknown as UserUnit;
};

// export const createPersonalChat = async (""): Promise<void> => {
//     const args = {};
//
// };

export const createGroupChat = async (name: string): Promise<void> => {
    const args = {};
    await http.post("/servers/chat/", args, JSON.stringify(name));
};