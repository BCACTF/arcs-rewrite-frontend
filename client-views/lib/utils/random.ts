const safeRandomCharsDict = '!"$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz|~';
const safeRandomFlagCharsDict = '-0123456789@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~';

const getRandomChar = () => safeRandomCharsDict[Math.floor(Math.random() * safeRandomCharsDict.length)];
const getRandomFlagChar = () => safeRandomFlagCharsDict[Math.floor(Math.random() * safeRandomFlagCharsDict.length)];

export const safeRandomChars = (count: number) => Array(count).fill(null).map(getRandomChar).join("");
export const safeRandomFlagChars = (count: number) => Array(count).fill(null).map(getRandomFlagChar).join("");




