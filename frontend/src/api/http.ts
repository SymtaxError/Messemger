export const backendURL = "";

const composeArgs = (args: Record<string, string>): string => {
    const entries = Object.entries(args);
    const params = entries.map(entry => `${entry[0]}=${entry[1]}`).join("&");
    return params.length ? `?${params}` : "";
};

const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": (localStorage.getItem("token") !== "undefined")
        ? `JWT-token ${localStorage.getItem("token")}`
        : ""
};

const request = async <T>(
    path: string,
    args: Record<string, string>,
    method: "GET" | "POST" | "DELETE",
    body?: string
): Promise<T> => {
    const params = composeArgs(args);
    const result = await fetch(
        `${backendURL}${path}${params}`,
        {method: method, body: body, headers: headers}
    );

    if (result.status === 403) {
        alert("Доступ запрещен");
    }
    if (result.status === 401) {
        const msg = (await result.text() === "denied")
            ? "Неправильный логин или пароль"
            : "Вы не авторизованы";
        alert(msg);
    }
    return JSON.parse(await result.text() || "null") as unknown as T;
};

export const http = {
    get: async <T>(path: string, args: Record<string, string>): Promise<T> => {
        return request(path, args, "GET");
    },
    post: async <T>(path: string, args: Record<string, string>, body?: string): Promise<T> => {
        return request(path, args, "POST", body);
    },
    delete: async <T>(path: string, args: Record<string, string>): Promise<T> => {
        return request(path, args, "DELETE");
    }
};