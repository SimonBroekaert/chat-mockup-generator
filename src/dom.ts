// Typed access to the DOM.
//
// The lib types say querySelector() returns `Element | null`; what the app
// usually needs is "the input with this id, which had better exist". These
// helpers narrow once, here, with instanceof — not with a generic parameter
// on querySelector (an assertion in disguise) and not with `!`.

type ElementType<T> = new () => T;

/** Throws if `value` is missing. Use where absence is a bug, not a state. */
export function must<T>(value: T | null | undefined, what: string): T {
    if (value === null || value === undefined) {
        throw new Error(`Missing ${what}`);
    }

    return value;
}

/** Like must(), and additionally checks the value is an instance of `type`. */
export function ensure<T>(value: unknown, type: ElementType<T>, what: string): T {
    if (value === null || value === undefined) {
        throw new Error(`Missing ${what}`);
    }

    if (!(value instanceof type)) {
        throw new Error(`${what} is not a ${type.name}`);
    }

    return value;
}

/**
 * querySelector() with an instanceof check. Null when nothing matches;
 * throws when something matches but is the wrong kind of element, because
 * that means the markup and the script disagree.
 */
export function query<T extends Element>(selector: string, type: ElementType<T>, root: ParentNode = document): T | null {
    const element = root.querySelector(selector);

    return element === null ? null : ensure(element, type, selector);
}

/** querySelectorAll() with the same instanceof check on every match. */
export function queryAll<T extends Element>(selector: string, type: ElementType<T>, root: ParentNode = document): T[] {
    return [...root.querySelectorAll(selector)].map((element) => ensure(element, type, selector));
}
