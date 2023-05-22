
type Heuristic = [(pass: string) => boolean, string];

const containsMatch = (str: string, match: RegExp): boolean => str.split("").some(s => s.match(match));
const doesntContainMatch = (str: string, match: RegExp): boolean => !containsMatch(str, match);

const doesntMatch = (str: string, match: RegExp): boolean => !str.match(match);

const heuristics: Heuristic[] = [
    [
        pass => pass.length < 10,
        "Password must be at least 10 characters long.",
    ],
    [
        pass => doesntContainMatch(pass, /[a-z]/),
        "Password must contain at least one lowercase letter.",
    ],
    [
        pass => doesntContainMatch(pass, /[A-Z]/),
        "Password must contain at least one uppercase letter.",
    ],
    [
        pass => doesntContainMatch(pass, /[\d]/),
        "Password must contain at least one number.",
    ],
    [
        pass => doesntContainMatch(pass, /[\W]/),
        "Password must contain at least one symbol.",
    ],
    [
        pass => doesntMatch(pass, /^[\x20-\x7F]*$/),
        "Password must contain only printable ascii characters.",
    ],
    [
        pass => containsMatch(pass, /[\x7F]/),
        "...delete???",
    ],
];

type PasswordError = { ok: true } | { ok: false, issue: string };

export const validatePassword = (password: string): PasswordError => {
    const validity = heuristics.find(heur => heur[0](password));
    if (validity) return { ok: false, issue: validity[1] };

    return { ok: true };
};
