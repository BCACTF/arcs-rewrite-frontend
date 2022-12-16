const safeRandomCharsDict = '!"$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz|~';

const getRandomChar = () => safeRandomCharsDict[Math.floor(Math.random() * safeRandomCharsDict.length)];

export const safeRandomChars = (count: number) => Array(count).fill(null).map(getRandomChar).join("");


