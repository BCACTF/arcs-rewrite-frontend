export type CreateNewTeam = {
    __tag: "create";

    initialUser: string;

    name: string;
    eligible: boolean;
    affiliation: string | null;
    password: string;
};

export type UpdateTeam = {
    __tag: "update";

    id: string;
    password: string;

    eligible: boolean;
    affiliation: string | null;

    name: string;
    description: string;

    newPassword: string | null;
};

export type GetTeam = {
    __tag: "get";

    id: string;
};
export type GetAllTeams = {
    __tag: "get_all";
};

type InnerTeamQuery = CreateNewTeam | UpdateTeam | GetTeam | GetAllTeams;

type TeamQuery = {
    section: "team";
    query: InnerTeamQuery;
};

export default TeamQuery;
