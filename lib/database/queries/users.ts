export type Auth = {
    __type: "pass";
    password: string;
} | {
    __type: "oauth";
    sub: string;
    provider: string;
    oauth_allow_token: string;
};

export type CheckUsernameAvailability = {
    query_name: "available";
    name: string;
};

export type CreateNewUser = {
    query_name: "create";

    email: string;
    name: string;
    auth: Auth;

    eligible: boolean;
    admin: boolean;
};

export type CheckUserAuth = {
    query_name: "check_auth";
    id: string;
    auth: Auth;
};
export type UpdateUserNamePass = {
    query_name: "update_auth";
    id: string;
    old_auth: Auth;
    new_auth: Auth;
};

export type UserJoinTeam = {
    query_name: "join";
    id: string;
    auth: Auth;

    team_name: string;
    team_pass: string;
};

export type GetUser = {
    query_name: "get";
    id: string;
};
export type GetAllUsers = {
    query_name: "get_all";
};

type InnerUserQuery = CreateNewUser | CheckUsernameAvailability | CheckUserAuth | UpdateUserNamePass | UserJoinTeam | GetUser | GetAllUsers;

type UserQuery = {
    __type: "user";
} & InnerUserQuery;

export default UserQuery;