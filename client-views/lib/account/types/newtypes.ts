const format = <T extends string>(idType: T, ident: string): `${T}:${string}` => `${idType}:${ident}`;

interface Id<T extends string> { 
    get id(): string;
    get formatted(): `${T}:${string}`;
    get _type(): T;
}

export class ChallId implements Id<"chall"> {
    constructor(private _id: string) {}

    public get id() { return this._id; }
    public get formatted() { return format("chall", this._id); }
    public get _type() { return "chall" as const; }

    public static parse(str: string): ChallId | null {
        const parsed = str.match(/^chall\:([a-zA-Z0-9_]*)$/)?.[1];
        if (!parsed) return null;
        else return new ChallId(parsed);
    }
}

export class UserId implements Id<"user"> {

    constructor(
        private _id: string,
        private _authMethod: { prefix: "email", provider: null } | { prefix: "oauth", provider: string }
    ) {}

    private get formattedPrefix(): `oauth:${string}` | `email` {
        return this._authMethod.prefix === "email" ? "email" : `oauth:${this._authMethod.provider}`;
    }


    public get id(): string { return this._id; }
    public get formatted() { return format("user", `${this.formattedPrefix}:${this._id}`); }
    public get _type() { return "user" as const; }

    public get isOauth(): boolean { return this._authMethod.prefix === "oauth"; }

    public get oauthProvider(): string | null { return this._authMethod.provider; }



    public static parse(str: string) {
        const parsedEmail = str.match(/^user:email\:([a-zA-Z0-9_]*)$/)?.[1];
        if (parsedEmail) return new UserId(parsedEmail, { prefix: "email", provider: null });

        const parsedOauth = str.match(/^user:oauth\:([a-zA-Z0-9_]*)\:([a-zA-Z0-9_]*)$/)?.slice(1, 3);
        if (parsedOauth) return new UserId(parsedOauth[0], { prefix: "oauth", provider: parsedOauth[1] });

        return null;
    }
}

export class TeamId implements Id<"team"> {
    constructor(private _id: string) {}

    public get id() { return this._id; }
    public get formatted() { return format("team", this._id); }
    public get _type() { return "team" as const; }

    public static parse(str: string): TeamId | null {
        const parsed = str.match(/^team\:([a-zA-Z0-9_]*)$/)?.[1];
        if (!parsed) return null;
        else return new TeamId(parsed);
    }
}
