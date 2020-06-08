import {createStore, Store, Event, createEvent, createEffect, Effect} from "effector";

export const getNewsRequest = async (): Promise<NewType[]> => {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": (localStorage.getItem("access") !== "undefined")
            ? `JWT ${localStorage.getItem("access")}`
            : ""
    };
    const response = await fetch(
        "api/news/?count=20&start=1",
        {method: "GET", headers: headers, mode: "cors"}
    );
    return JSON.parse(await response.text()) as unknown as NewType[];
};



interface NewType {
    title: string
    text: string
}

interface NewsList {
    news: NewType[]
}

const initialData: NewsList = {
    news: []
};

interface NewsStore extends Store<NewsList> {
    setNews: Event<NewType[]>
    getNews: Effect<void, NewType[]>
}

export const NewsStore = (() => {
    const store = createStore<NewsList>(initialData) as NewsStore;

    store.setNews = createEvent<NewType[]>("set all users");
    store.on(store.setNews, ((state, payload) => ({ ...state, news: payload })));

    store.getNews = createEffect({
        name: "get all news",
        handler: async (): Promise<NewType[]> => {
            const response = await getNewsRequest();
            return response as unknown as Promise<NewType[]>;
        }
    });
    store.getNews.fail.watch(({ error }) => {
        console.error("Bad credentials", error);
        return;
    });
    store.getNews.done.watch(result => {
        store.setNews(result.result);
    });

    store.getNews();
    return store;
})();