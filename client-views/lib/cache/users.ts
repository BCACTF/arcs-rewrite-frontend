import { TeamId, teamIdToStr, teamIdFromStr, UserId } from "cache/ids";
import cache from "cache/index";

export type UserType = "normal" | "writer" | "admin";

export interface ClientSideMeta {
    name: string;

    score: number;
    lastSolve?: Date;

    teamId?: TeamId;
}

export interface CachedUser {
    userId: UserId;
    email: string;
    
    clientSideMetadata: ClientSideMeta;

    type: UserType;
    
    teamId?: TeamId;

    visible: boolean;
}


export const USER_HASH_KEY = "user";

const parseUser = (userJson: string): CachedUser | null => {
    const parsed: unknown = JSON.parse(userJson);

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;

    // FIXME: THIS FILE IS NOT DONE.
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
    const points = pointsRaw;
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

export const getTeams = async (ids: TeamId[]): Promise<CachedTeamMeta[]> => {
    const rawCachedTeams = await cache.hmget(TEAM_HASH_KEY, ...ids.map(teamIdToStr));
    const optCachedTeams = rawCachedTeams.flatMap(raw => raw ? [raw] : []).map(parseTeam);

    return optCachedTeams.flatMap(team => team ? [team] : []);
};
export const getAllTeamenges = async (): Promise<CachedTeamMeta[]> => {
    const rawCachedTeams = await cache.hvals(TEAM_HASH_KEY);
    const optCachedTeams = rawCachedTeams.flatMap(raw => raw ? [raw] : []).map(parseTeam);

    return optCachedTeams.flatMap(team => team ? [team] : []);
};
const getAllTeamKeys = async (): Promise<string[]> => await cache.hkeys(TEAM_HASH_KEY);

export const getAllTeamIds = async (): Promise<TeamId[]> => (await cache.hkeys(TEAM_HASH_KEY))
    .map(teamIdFromStr)
    .flatMap(id => id ? [id] : []);

export const update = async (teamData: CachedTeamMeta): Promise<CachedTeamMeta | null> => {
    const teamIdStr = teamIdToStr(teamData.id);

    const setResult = await cache
        .pipeline()
        .hget(TEAM_HASH_KEY, teamIdToStr(teamData.id))
        .hset(TEAM_HASH_KEY, { [teamIdStr]: JSON.stringify(teamData) })
        .exec();
    
    const retRes = setResult?.[0]?.[1];
    if (typeof retRes !== "string" || !retRes) return null;
    return parseTeam(retRes);
};
export const removeStale = async (notStale: TeamId[]): Promise<TeamId[]> => {
    const currSet = new Set(notStale.map(teamIdToStr));
    const cachedIds = await getAllTeamKeys();
    const removeIds = cachedIds.filter(id => !currSet.has(id));
    await cache.hdel(TEAM_HASH_KEY, ...removeIds);

    return removeIds.map(teamIdFromStr).flatMap(id => id ? [id] : []);
};

export const sortBy = (teams: CachedTeamMeta[]) => [...teams].sort((a, b) => a.score - b.score);

