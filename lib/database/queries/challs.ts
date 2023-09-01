export type GetChallenge = {
    query_name: "get";
    id: string;
};
export type GetAllChallenges = {
    query_name: "get_all";
};

type InnerChallengeQuery = GetChallenge | GetAllChallenges;

type ChallengeQuery = {
    __type: "chall";
} & InnerChallengeQuery;

export default ChallengeQuery;