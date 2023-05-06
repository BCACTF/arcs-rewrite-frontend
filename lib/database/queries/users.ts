export type Auth = {
    __type: "pass";
    password: string;
} | {
    __type: "oauth";
    sub: string;
    provider: string;
    trustedClientAuth: string;
};

export type CreateNewUser = {
    __tag: "create";

    email: string;
    name: string;
    auth: Auth;
    eligible: boolean;
};

export type CheckUserAuth = {
    __tag: "auth";
    id: string;
    auth: Auth;
};
export type UpdateUserNamePass = {
    __tag: "update";
    id: string;
    auth: Auth;

    name: string;
    newPassword: string | null;

    eligible: boolean;
};

export type UserJoinTeam = {
    __tag: "join";
    id: string;
    auth: Auth;

    teamId: string;
    teamPassword: string;
};

export type GetUser = {
    __tag: "get";
    id: string;
};
export type GetAllUsers = {
    __tag: "get_all";
};

type InnerUserQuery = CreateNewUser | CheckUserAuth | UpdateUserNamePass | UserJoinTeam | GetUser | GetAllUsers;

type UserQuery = {
    section: "user";
    query: InnerUserQuery;
};

export default UserQuery;