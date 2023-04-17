type ReadonlyDeep<T> = 
    T extends Record<string, any> ? Readonly<{ [P in keyof T]: ReadonlyDeep<T[P]> }> :
    T extends (infer I)[] ? ReadonlyDeep<I>[] :
    T;

export default ReadonlyDeep;