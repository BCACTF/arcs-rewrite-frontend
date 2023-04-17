export type GetChallenge = {
    __tag: "get";
    id: string;
};
export type GetAllChallenges = {
    __tag: "get_all";
};

type InnerChallengeQuery = GetChallenge | GetAllChallenges;

type ChallengeQuery = {
    section: "challenge";
    query: InnerChallengeQuery;
};

export default ChallengeQuery;