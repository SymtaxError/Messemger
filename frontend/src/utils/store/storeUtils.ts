/* eslint-disable max-len */
import { createEvent, Event } from "effector";

interface SVEventArg<T, K extends keyof T> {
    property: keyof T
    value: T[K]
}

export const origEv = Symbol();

interface PrependedEvent<T, Before> extends Event<T> {
    [origEv]: Event<Before>
}

export const createSVEvent = <T extends object>() => <K extends keyof T>(property: K) => {
    const original = createEvent<SVEventArg<T, K>>("set_" + property);

    const prepended: PrependedEvent<T[K], SVEventArg<T, K>> =
        original.prepend<T[K]>(x => ({ property, value: x })) as
            PrependedEvent<T[K], SVEventArg<T, K>>;
    prepended[origEv] = original;

    return prepended;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const extend = <T extends object>(obj: T, props: Partial<T>) =>
    Object.assign(Object.create(Object.getPrototypeOf(obj)), obj, props);

export const autoSV = <T extends object, K extends keyof T>(obj: T, ev: SVEventArg<T, K>): T =>
    extend(obj, { [ev.property]: ev.value } as T);

export const condSV = <T extends object>(cond: (x: T) => boolean) => <K extends keyof T>(obj: T, ev: SVEventArg<T, K>): T =>
    cond(obj) ? extend(obj, { [ev.property]: ev.value } as T) : obj;

// store projection

type ObjT = {[key in string | number | symbol]: unknown};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const compare = (a: unknown, b: unknown) => (a !== a && b !== b) || (a === b);

const shallowCompareObjects = (a: ObjT, b: ObjT): boolean => {
    if (a === b) return true;

    for (const key in a) {
        // noinspection JSUnfilteredForInLoop
        if (!compare(a[key], b[key])) {
            return false;
        }
    }

    for (const key in b) {
        // noinspection JSUnfilteredForInLoop
        if (!compare(a[key], b[key])) {
            return false;
        }
    }

    return true;
};

const shallowCompareArrays = (a: unknown[], b: unknown[]): boolean => {
    if (a === b) return true;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++)
        if (!compare(a[i], b[i])) return false;

    return true;
};

export const stableMap = <T1, T2>(mapFn: (t: T1) => T2): (t: T1) => T2 => {
    let state: T2 = undefined!;

    return t => {
        const newState = mapFn(t);

        if (newState === state) return state;
        if (Array.isArray(newState) && Array.isArray(state)) {
            if (shallowCompareArrays(newState, state))
                return state;
        } else if (typeof state === "object" && typeof newState === "object") {
            if (shallowCompareObjects(state as never, newState as never))
                return state;
        }

        state = newState;
        return newState;
    };
};
//
// export const useMappedStore = <T, T2>(store: Store<T>, mapFn: (t: T) => T2): T2 =>
//     useStore(store.map(stableMap(mapFn)));