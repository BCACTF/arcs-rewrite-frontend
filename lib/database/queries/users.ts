export type CreateNewUser = {
    __tag: "create";

    email: string;
    name: string;
    password: string;
    eligible: boolean;
};

export type UpdateUserNamePass = {
    __tag: "update";
    id: string;
    password: string;

    name: string;
    newPassword: string | null;

    eligible: boolean;
};

export type UserJoinTeam = {
    __tag: "join";
    id: string;
    password: string;

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

type InnerUserQuery = CreateNewUser | UpdateUserNamePass | UserJoinTeam | GetUser | GetAllUsers;

type UserQuery = {
    section: "user";
    query: InnerUserQuery;
};

export default UserQuery;