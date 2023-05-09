export const toCountFrom = (c: string, n: number) => (
    c
        .repeat(n).split("")
        .map((c, i) => c.charCodeAt(0) + i)
        .map(n => String.fromCharCode(n)).join("")
);

const lower = toCountFrom("a", 26);
const upper = toCountFrom("A", 26);
const numer = toCountFrom("0", 10);
const symbl = "_-.+<>@$#!~?*&¿=¡()[]";
const specl = "àáâäèéêëíîïòóôöùúûüñßÿ" + "ÀÁÂÄÈÉÊËÍÎÏÒÓÔÖÙÚÛÜÑŸ";

const charSet = new Set([
    ...lower.split(""),
    ...upper.split(""),
    ...numer.split(""),
    ...symbl.split(""),
    ...specl.split(""),
]);

const minLen = 3;
const maxLen = 32;

export type UsernameIssue = {
    __type: "bad_chars", chars: Set<string>,
} | {
    __type: "too_short", name: string,
} | {
    __type: "too_long", name: string,
};

export const MONO_SEPERATOR = "{{MONOSPACE}}"

export const getIssueText = (issue: UsernameIssue) => {
    switch (issue.__type) {
        case "bad_chars": {
            const characters = `${MONO_SEPERATOR}${[...issue.chars.values()].join("")}${MONO_SEPERATOR}`;
            const plurality = issue.chars.size === 1 ? '' : 's';
            const conjugation = issue.chars.size === 1 ? 'is' : 'are';
            const p1 = `The character${plurality} ${characters} ${conjugation} not allowed in usernames.`;
            const sym = `${MONO_SEPERATOR}${symbl}${MONO_SEPERATOR}`;
            const sch = `${MONO_SEPERATOR}ß${MONO_SEPERATOR}`;
            const ene = `${MONO_SEPERATOR}ñÑ${MONO_SEPERATOR}`;
            const vow = `diaeresis/accented/circumflex (${MONO_SEPERATOR}àáâäÀ${MONO_SEPERATOR}...) vowels`;

            const p2 = `Only alphanumeric characters, ${sym}, ${sch}, ${ene}, and ${vow} are allowed.`;

            return `${p1}\n${p2}`;
        }
        case "too_short": return `The username must be at least ${minLen} characters long.`;
        case "too_long": return `The username must be at most ${maxLen} characters long.`;
    }
};

const getUsernameIssue = (name: string): UsernameIssue | null => {
    if (name.length < minLen) return { __type: "too_short", name };
    else if (name.length > maxLen) return { __type: "too_long", name };
    else if (name.split("").some(c => !charSet.has(c))) return {
        __type: "bad_chars",
        chars: new Set(name.split("").filter(c => !charSet.has(c))),
    }
    else return null;
}

export default getUsernameIssue;


