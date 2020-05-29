import {UserUnit} from "api/models/user";


export const backendURL = "http://localhost:8000";

const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "access": (localStorage.getItem("access") !== "undefined")
        ? `${localStorage.getItem("access")}`
        : ""
};

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
        {method: "POST", body: JSON.stringify(bodyForCheck)}
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
): Promise<T> => {
    const result = await fetch(
        `${backendURL}${path}}`,
        {method: method, headers: headers, body: body}
    );
    if (result.status === 403) {
        await resultRefresh();
    } else if (result.status === 401) {
        alert(result.text());
    }
    return JSON.parse(await result.text() || "null") as unknown as T;
};

export const http = {
    get: async <T>(path: string, args: Record<string, string>): Promise<T> => {
        return request(path, "GET");
    },
    post: async <T>(path: string, args: Record<string, string>, body?: string): Promise<T> => {
        return request(path, "POST", body);
    },
    delete: async <T>(path: string, args: Record<string, string>): Promise<T> => {
        return request(path,"DELETE");
    }
};

export const registerRequest = async (user: UserUnit): Promise<void> => {
    const args = {};
    await http.post("/users/register/", args, JSON.stringify(user));
    return;
};

export const loginRequest = async (email: string, password: string): Promise<void> => {
    const args = {};
    await http.post("/auth/jwt/login/", args, JSON.stringify({"email": email, "password": password}));
    return;
};