export const known = <T>(x: T | null | undefined): x is T => x !== null && x !== undefined;
export const nonEmpty = (v: string | unknown[] | undefined): boolean => {
    return typeof v === "string" ? !v.trim().length : !!v && !v.length;
};