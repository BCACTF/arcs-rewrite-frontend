type Optionalized<T, K extends (string | number | symbol) & keyof T> = {
    [key in keyof Omit<T, K>]: T[key];
} & {
    [key in K]?: T[key];
};



export const omitted = <T, K extends keyof T>(object: T, keys: K[]): Omit<T, K> => {
    const omitted: Optionalized<T, K> = {...object};
    for (const key of keys) {
        delete omitted[key];
    }
    return omitted
};

export const optionalized = <T, K extends keyof T>(object: T): Optionalized<T, K> => {
    return {...object};
};
