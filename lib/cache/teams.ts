import { TeamId, teamIdToStr, teamIdFromStr } from "cache/ids";
import cache from "cache/index";
import { apiLogger } from "logging";

export interface CachedTeamMeta {
    id: TeamId;
    name: string;

    score: number;
    lastSolve: number | null,

    eligible: boolean;
    affiliation: string | null;
}

export const TEAM_HASH_KEY = "team";

export const parseTeam = (teamJson: string): CachedTeamMeta | null => {
    // apiLogger.trace`Parsing team ${teamJson}`;

    const parsed: unknown = JSON.parse(teamJson);

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;

    const {
        id: idRaw,
        name: nameRaw,
        score: scoreRaw,
        eligible: eligRaw,

        lastSolve: lastSolveRaw,
        affiliation: affiliationRaw,
    } = parsed as Record<string, unknown>;

    {
        const id = typeof idRaw === 'string';
        const name = typeof nameRaw === 'string';
        const score = typeof scoreRaw === 'number' && Number.isInteger(scoreRaw) && scoreRaw >= 0;
        const elig = typeof eligRaw === 'boolean';
        if (!id || !name || !score || !elig) {
            apiLogger.trace`Parsing team ${teamJson}`;
            apiLogger.trace`Parsing failed: ${{ id, name, score, eligible: elig }}`;
            return null;
        }
    }
    
    const teamId = teamIdFromStr(idRaw);
    if (!teamId) {
        apiLogger.trace`Parsing team ${teamJson}`;
        apiLogger.trace`Parsing failed: ${{ teamId }}`;
        return null;
    }

    {
        const lastSolve = typeof lastSolveRaw === 'number' || typeof lastSolveRaw === 'string' || lastSolveRaw === undefined || lastSolveRaw === null;
        const affiliation = typeof affiliationRaw === 'string' || affiliationRaw === undefined || affiliationRaw === null;
        if (!lastSolve || !affiliation) {
            apiLogger.trace`Parsing team ${teamJson}`;
            apiLogger.trace`Parsing failed: ${{ lastSolve, affiliation }}`;
            return null;
        }
    }

    const id = teamId;
    const name = nameRaw;
    const score = scoreRaw;
    const eligible = eligRaw;

    const lastSolve = lastSolveRaw
        ? typeof lastSolveRaw === "number"
            ? new Date(lastSolveRaw * 1000).getTime() / 1000
            : new Date(lastSolveRaw).getTime() / 1000
        : null;
    const affiliation = affiliationRaw ?? null;

    return { id, name, score, eligible, lastSolve, affiliation };
}

export const getTeams = async (ids: TeamId[]): Promise<CachedTeamMeta[]> => {
    const rawCachedTeams = await (await cache()).hmget(TEAM_HASH_KEY, ...ids.map(teamIdToStr));
    const optCachedTeams = rawCachedTeams.flatMap(raw => raw ? [raw] : []).map(parseTeam);

    return optCachedTeams.flatMap(team => team ? [team] : []);
};
export const getAllTeams = async (): Promise<CachedTeamMeta[]> => {
    const rawCachedTeams = await (await cache()).hvals(TEAM_HASH_KEY);
    const optCachedTeams = rawCachedTeams.flatMap(raw => raw ? [raw] : []).map(parseTeam);

    return optCachedTeams.flatMap(team => team ? [team] : []);
};
const getAllTeamKeys = async (): Promise<string[]> => await (await cache()).hkeys(TEAM_HASH_KEY);

export const update = async (teamData: CachedTeamMeta): Promise<CachedTeamMeta | null> => {
    const teamIdStr = teamIdToStr(teamData.id);

    const setResult = await (await cache())
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
    if (removeIds.length) await (await cache()).hdel(TEAM_HASH_KEY, ...removeIds);

    return removeIds.map(teamIdFromStr).flatMap(id => id ? [id] : []);
};




export enum SortingCriteria {
    POINTS_HIGH_FIRST,
    LASTSOLVE,
    NAME,
    ELIG,
}

const { POINTS_HIGH_FIRST, LASTSOLVE, NAME, ELIG } = SortingCriteria;


const compareCriteria = (a: CachedTeamMeta, b: CachedTeamMeta, criteria: SortingCriteria) => {
    switch (criteria) {
        case POINTS_HIGH_FIRST:
            return b.score - a.score;
        case LASTSOLVE:
            return (a.lastSolve ?? -1) - (b.lastSolve ?? -1);
        case NAME:
            return a.name.localeCompare(b.name);
        case ELIG:
            return Number(a.eligible) - Number(b.eligible);
    }
}


export const sortBy = (challs: CachedTeamMeta[], criteria: SortingCriteria[] = [POINTS_HIGH_FIRST, LASTSOLVE, NAME, ELIG]) => {
    const compareFn = (a: CachedTeamMeta, b: CachedTeamMeta) => criteria
        .map(c => compareCriteria(a, b, c))
        .find(v => v !== 0) ?? 0;
    return [...challs].sort(compareFn);
};

