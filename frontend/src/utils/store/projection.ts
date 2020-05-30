import { Store, Subscription } from "effector";
import { shallowEqual } from "../misc";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";

const stableMap = <T1, T2>(mapFn: (t: T1) => T2): (t: T1) => T2 => {
    let state: T2 = undefined!;

    return t => {
        const newState = mapFn(t);

        if (shallowEqual(newState, state)) return state;

        state = newState;
        return newState;
    };
};

type ReactSubscription = Subscription & { active: boolean };

export const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const useMappedStore = <T, T2>(store: Store<T>, mapFn: (t: T) => T2): T2 => {
    const m = stableMap(mapFn);

    const [state, setState] = useState(() => m(store.getState()));
    const subscription = useMemo(() => {
        const subscription = store.updates.watch(upd => {
            if (!subscription.active) return;

            setState(m(upd));
        }) as ReactSubscription;

        subscription.active = true;
        return subscription;
    }, [store]);

    useIsomorphicLayoutEffect(
        () => () => {
            subscription.active = false;
            subscription();
        },
        [subscription]
    );

    return state;
};