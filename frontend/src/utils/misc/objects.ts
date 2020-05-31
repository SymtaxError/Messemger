export type None = null | undefined;

export const extend = <T extends object>(obj: T, props: Partial<T>): T =>
    Object.assign(Object.create(Object.getPrototypeOf(obj)), obj, props);

export const applyN = <T, R, S extends T | None>(m: (_: T) => R, s: S): R | (S extends None ? undefined : never) =>
    s !== null && s !== undefined ? m(s!) : undefined as never;