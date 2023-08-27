import { Auth } from "./users";

export type SubmitAttempt = {
    query_name: "attempt";
    
    user_id: string,
    team_id: string,
    chall_id: string,

    flag_guess: string,

    user_auth: Auth
};

export type GetTeamSolves = {
    query_name: "get_team";
    id: string;
};
export type GetUserSolves = {
    query_name: "get_user";
    id: string;
};
export type GetChallengeSolves = {
    query_name: "get_challenge";
    id: string;
};
export type GetAllSolves = {
    query_name: "get_all";
};

type InnerSolveQuery = SubmitAttempt | GetTeamSolves | GetUserSolves | GetChallengeSolves | GetAllSolves;

type SolveQuery = {
    __type: "solve";
} & InnerSolveQuery;

export default SolveQuery;
