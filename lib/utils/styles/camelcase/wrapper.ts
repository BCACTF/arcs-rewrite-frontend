import { BasicRecord, wrapSpecialKey } from "../general";
import { WrapCamelCaseBuilder, wrapCamelCaseBuilder } from "./builder";
import { getCamelCaseVal } from "./index";


export type WrapCamelCase = Omit<BasicRecord, typeof wrapSpecialKey> & { [wrapSpecialKey]: () =>WrapCamelCaseBuilder };

export const wrapCamelCase = (inputStyles: BasicRecord): Readonly<[Readonly<WrapCamelCase>, Readonly<WrapCamelCaseBuilder>]> => {
    const inputObj = Object.fromEntries(
        Object
            .entries(inputStyles)
            .map(
                ([name, className]) => [`__${name}`, className],
            ),
    );
    const wrapped = Object.freeze(new Proxy<BasicRecord>(inputObj, {
        get: (target: BasicRecord, key: string | symbol) => {
            if (key === wrapSpecialKey) return () => wrapCamelCaseBuilder(target, new Set());
            else if (typeof key !== "string") return undefined;
            return getCamelCaseVal(target, key);
        },
    }) as WrapCamelCase);

    return [wrapped, wrapped.builder()];
};