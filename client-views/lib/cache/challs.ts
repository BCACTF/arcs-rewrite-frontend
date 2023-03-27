import { ChallId, challIdToStr, challIdFromStr, DeploymentId, deployIdFromStr, uuidToStr, newRandomUuid } from "cache/ids";
import cache from "cache/index";

export interface ClientSideMeta {
    name: string;
    points: number;
    desc: string;
    solveCount: number;
    categories: string[];
    authors: string[];
    hints: string[];
    tags: string[];

    links: any;
}

export interface CachedChall {
    deploymentUuid: DeploymentId;
    challId: ChallId;

    clientSideMetadata: ClientSideMeta;

    visible: boolean;
};

export const CHALLENGE_HASH_KEY = "chall";

const parseChallenge = (challJson: string): CachedChall | null => {
    const parsed: unknown = JSON.parse(challJson);

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;

    const {
        visible: visRaw,
        challId: challRaw,
        deploymentUuid: depRaw,
        clientSideMetadata: csmRaw,
    } = parsed as Record<string, unknown>;

    {
        const vis = typeof visRaw === 'boolean';
        const chall = typeof challRaw === 'string';
        const dep = typeof depRaw === 'string';
        if (!vis || !chall || !dep) return null;
    }

    const challId = challIdFromStr(challRaw);
    const deploymentUuid = deployIdFromStr(depRaw);
    if (!challId || !deploymentUuid) return null;

    if (typeof csmRaw !== 'object' || csmRaw === null) return null;

    const {
        name: nameRaw,
        points: pointsRaw,
        desc: descRaw,
        solveCount: solveRaw,
        categories: catRaw,
        authors: authRaw,
        hints: hintsRaw,
        tags: tagsRaw,
        links,
    } = csmRaw as Record<string, unknown>;

    {
        const name = typeof nameRaw === 'string';
        const points = typeof pointsRaw === 'number' && pointsRaw >= 0;
        const desc = typeof descRaw === 'string';
        const sol = typeof solveRaw === 'number' && solveRaw >= 0;
        const cat = Array.isArray(catRaw);
        const auth = Array.isArray(authRaw);
        const hint = Array.isArray(hintsRaw);
        const tag = Array.isArray(tagsRaw);
        
        if (
            !name    || !points || !desc   ||
            !sol     || !cat    || !auth   ||
            !hint    || !tag
        ) return null;
    }
    {
        const cats = catRaw.every((s) => typeof s === 'string');
        const auths = authRaw.every((s) => typeof s === 'string');
        const hints = hintsRaw.every((s) => typeof s === 'string');
        const tags = tagsRaw.every((s) => typeof s === 'string');

        if (!cats || !auths || !hints || !tags) return null;
    }

    const visible = visRaw;

    const name = nameRaw;
    const points = pointsRaw;;
    const desc = descRaw;
    const solveCount = solveRaw;
    const categories = catRaw;
    const authors = authRaw;
    const hints = hintsRaw;
    const tags = tagsRaw;

    const clientSideMetadata: ClientSideMeta = {
        name, points, desc, solveCount, categories, authors, hints, tags, links
    };

    return { visible, challId, deploymentUuid, clientSideMetadata };
}

export const getChallenges = async (ids: ChallId[]): Promise<CachedChall[]> => {
    const rawCachedChalls = await cache.hmget(CHALLENGE_HASH_KEY, ...ids.map(challIdToStr));
    const optCachedChalls = rawCachedChalls.flatMap(raw => raw ? [raw] : []).map(parseChallenge);

    return optCachedChalls.flatMap(chall => chall ? [chall] : []);
};
export const getAllChallenges = async (): Promise<CachedChall[]> => {
    const rawCachedChalls = await cache.hvals(CHALLENGE_HASH_KEY);
    const optCachedChalls = rawCachedChalls.flatMap(raw => raw ? [raw] : []).map(parseChallenge);

    return optCachedChalls.flatMap(chall => chall ? [chall] : []);
};
const getAllChallKeys = async (): Promise<string[]> => await cache.hkeys(CHALLENGE_HASH_KEY);

export const getAllChallIds = async (): Promise<ChallId[]> => (await cache.hkeys(CHALLENGE_HASH_KEY))
    .map(challIdFromStr)
    .flatMap(id => id ? [id] : []);

export const update = async (challData: CachedChall): Promise<CachedChall | null> => {
    const challIdStr = challIdToStr(challData.challId);

    const setResult = await cache
        .pipeline()
        .hget(CHALLENGE_HASH_KEY, challIdToStr(challData.challId))
        .hset(CHALLENGE_HASH_KEY, { [challIdStr]: JSON.stringify(challData) })
        .exec();
    
    const retRes = setResult?.[0]?.[1];
    if (typeof retRes !== "string" || !retRes) return null;
    return parseChallenge(retRes);
};
export const removeStale = async (notStale: ChallId[]): Promise<ChallId[]> => {
    const currSet = new Set(notStale.map(challIdToStr));
    const cachedIds = await getAllChallKeys();
    const removeIds = cachedIds.filter(id => !currSet.has(id));
    await cache.hdel(CHALLENGE_HASH_KEY, ...removeIds);

    return removeIds.map(challIdFromStr).flatMap(id => id ? [id] : []);
};


export enum SortingCriteria {
    POINTS,
    CATEGORY,
    SOLVES,
    NAME,
}

const { POINTS, CATEGORY, SOLVES, NAME } = SortingCriteria;


const compareCriteria = (a: CachedChall, b: CachedChall, criteria: SortingCriteria) => {
    switch (criteria) {
        case POINTS:
            return a.clientSideMetadata.points - b.clientSideMetadata.points;
        case CATEGORY:
            return a.clientSideMetadata.categories[0].localeCompare(b.clientSideMetadata.categories[0]);
        case SOLVES:
            return a.clientSideMetadata.solveCount - b.clientSideMetadata.solveCount;
        case NAME:
            return a.clientSideMetadata.name.localeCompare(b.clientSideMetadata.name);
    }
}


export const sortBy = (challs: CachedChall[], criteria: SortingCriteria[] = [POINTS, CATEGORY, NAME]) => {
    const compareFn = (a: CachedChall, b: CachedChall) => criteria
        .map(c => compareCriteria(a, b, c))
        .find(v => v !== 0) ?? 0;
    return [...challs].sort(compareFn);
};

