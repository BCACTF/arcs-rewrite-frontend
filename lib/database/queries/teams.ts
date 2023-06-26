export type CheckTeamnameAvailability = {
    query_name: "available";
    name: string;
};

export type CreateNewTeam = {
    query_name: "create";

    initialUser: string;

    name: string;
    eligible: boolean;
    affiliation: string | null;
    password: string;
};

export type UpdateTeam = {
    query_name: "update";

    id: string;
    password: string;

    name: string | null;
    description: string | null;
    eligible: boolean | null;
    affiliation: string | null;
};

export type GetTeam = {
    query_name: "get";

    id: string;
};
export type GetAllTeams = {
    query_name: "get_all";
};

type InnerTeamQuery = CheckTeamnameAvailability | CreateNewTeam /*| UpdateTeam*/ | GetTeam | GetAllTeams;

type TeamQuery = {
    __type: "team";
} & InnerTeamQuery;

export default TeamQuery;
