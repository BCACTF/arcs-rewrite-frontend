export type SubmitAttempt = {
    __tag: "submit";
    
    user_id: string,
    team_id: string,
    challenge_id: string,

    flag: string,
};

export type GetTeamSolves = {
    __tag: "get_team";
    id: string;
};
export type GetUserSolves = {
    __tag: "get_user";
    id: string;
};
export type GetChallengeSolves = {
    __tag: "get_challenge";
    id: string;
};
export type GetAllSolves = {
    __tag: "get_all";
};

type InnerSolveQuery = SubmitAttempt | GetTeamSolves | GetUserSolves | GetChallengeSolves | GetAllSolves;

type SolveQuery = {
    section: "solve";
    query: InnerSolveQuery;
};

export default SolveQuery;
