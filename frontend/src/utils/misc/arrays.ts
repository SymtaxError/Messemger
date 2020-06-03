export const replaceOrPush = <T>(array: T[], oldI: T | undefined, newI: T): T[] => {
    const ix = oldI !== undefined ? array.indexOf(oldI) : -1;
    if  (ix >= 0) {
        const copy = [...array];
        copy.splice(ix, 1, newI);

        return copy;
    } else {
        return [...array, newI];
    }
};