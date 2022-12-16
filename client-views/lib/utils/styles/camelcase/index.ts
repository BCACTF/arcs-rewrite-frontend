import { BasicRecord } from "../general";
export { wrapCamelCase } from "./wrapper";


export const camelCaseConvert = (str: string, sep = "-") => str.replace(/[A-Z]/g, letter => `${sep}${letter.toLowerCase()}`);
export const getCamelCaseVal = (record: BasicRecord, targetKey: string) => (
    `__${targetKey}` in record ? record[`__${targetKey}`] : record[`__${camelCaseConvert(targetKey, "-")}`]
);

