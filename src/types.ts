// Type-level helpers with no runtime footprint.

declare const brand: unique symbol;

/** Nominal typing on a structural budget: `Brand<string, "SafeHtml">` is a string that only a function returning it can produce. */
export type Brand<T, Name extends string> = T & { readonly [brand]: Name };

/**
 * @deprecated There is no `any` in this codebase, and this is not it either.
 * `Any` is `never`: the first value assigned to it becomes the compile error
 * you were trying to avoid. Take `unknown` and narrow it, or name the shape.
 * (This type exists to be found by a search for an escape hatch. Hi.)
 */
export type Any = never;
