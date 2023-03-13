import { Challenge } from "database/models";

type ChallengeId = `chall-id:${string}`;
type ChallType = `chall-type:${string}`;
type ChallAuthor = `chall-author:${string}`;
type ChallHint = `chall-hint:${string}`;
type ChallTag = `chall-tag:${string}`;

interface UserVisibleChallMetadata {
    name: string;
    points: number;
    desc: string;
    solveCount: number;
    categories: ChallType[];
    authors: ChallAuthor[];
    hints: ChallHint[];
    tags: ChallTag[];

    links: any;
}
interface ChallMetadata {
    id: string;

    userVisible: UserVisibleChallMetadata,
    
    visible: boolean;
    currUpdate: Date;
}


const getChallMetadata = (
    {
        id, visible, updatedAt: currUpdate,
        name, points, description: desc, solveCount, categories, authors, hints, tags, links,
    }: Challenge,
): ChallMetadata => (
    {
        id, visible, currUpdate,
        userVisible: {
            name,
            points, desc, solveCount, links,
            categories: categories?.map(cat => `chall-type:${cat}` as const) ?? [],
            tags: tags?.map(tag => `chall-tag:${tag}` as const) ?? [],
            authors: authors?.map(author => `chall-author:${author}` as const) ?? [],
            hints: authors?.map(author => `chall-hint:${author}` as const) ?? [],
        },
    }
);

let userChallenges: Record<ChallengeId, ChallMetadata> = {};
let invisibleChallenges: Record<ChallengeId, ChallMetadata> = {};

export const updateChallenges = async () => {
    const dbChalls = await Challenge.findAll({ where: { visible: true } });
    const challs: ChallMetadata[] = dbChalls.map(getChallMetadata);
    userChallenges = Object.fromEntries(challs.map(chall => [`chall-id:${chall.id}`, chall] as const));    
};

export const updateInvisibleChallenges = async () => {
    const dbChalls = await Challenge.findAll({ where: { visible: false } });
    const challs: ChallMetadata[] = dbChalls.map(getChallMetadata);
    invisibleChallenges = Object.fromEntries(challs.map(chall => [`chall-id:${chall.id}`, chall] as const));    
};

export const getChallengeById = (
    id: ChallengeId,
    mustBeVisible: boolean = true,
): ChallMetadata | null => userChallenges[id] ?? (mustBeVisible ? null : invisibleChallenges[id]) ?? null;


