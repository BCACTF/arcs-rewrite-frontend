import { TeamId, teamIdToStr, teamIdFromStr, UserId, ChallId, userIdFromStr, challIdFromStr, challIdToStr } from "cache/ids";
import cache from "cache/index";
import { getAllTeams } from "./teams";

export interface CachedSolveMeta {
    teamId: TeamId;
    userId: UserId;
    challId: ChallId;
    time: number;
}

export const SOLVE_HASH_KEY_PREFIX = "solve:";
const getRedisKey = (teamId: TeamId) => `${SOLVE_HASH_KEY_PREFIX}${teamIdToStr(teamId)}`;

export const parseSolve = (solveVal: string): CachedSolveMeta | null => {
    let parsed: unknown = undefined;
    try {
        parsed = JSON.parse(solveVal);
    } catch (e) {
        return null;
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;

    const {
        userId: uidRaw,
        teamId: tidRaw,
        challId: cidRaw,
        time: timeRaw,
    } = parsed as Record<string, unknown>;

    {
        const userId = typeof uidRaw === 'string';
        const teamId = typeof tidRaw === 'string';
        const challId = typeof cidRaw === 'string';
        const time = typeof timeRaw === 'string' || typeof timeRaw === 'number';
        if (!userId || !teamId || !challId || !time) return null;
    }

    const userId = userIdFromStr(uidRaw);
    const teamId = teamIdFromStr(tidRaw);
    const challId = challIdFromStr(cidRaw);
    const time = typeof timeRaw === "number" ? new Date(timeRaw * 1000).getTime() / 1000 : new Date(timeRaw).getTime() / 1000;
    if (!userId || !teamId || !challId || !time) return null;

    return { userId, teamId, challId, time };
}

export const getSolves = async (id: TeamId): Promise<CachedSolveMeta[]> => {
    const redisKey = getRedisKey(id);
    const rawCachedSolves = await (await cache()).hgetall(redisKey);
    const optCachedSolves = Object.values(rawCachedSolves)
        .map(solveData => parseSolve(solveData));

    return optCachedSolves.flatMap(solve => solve ? [solve] : []);
};

export const getAllSolves = async (): Promise<CachedSolveMeta[]> => {
    const allTeams = await getAllTeams();
    const teamKeys = allTeams.map(team => getRedisKey(team.id));

    const redis = await cache();

    let multi = redis.multi({ pipeline: true });
    teamKeys.forEach(key => multi = multi.hgetall(key));
    
    const rawCachedSolves = await multi.exec();
    if (!rawCachedSolves) return [];
    const rawSolvesFlat = rawCachedSolves.flatMap(res => res[1] && Object.values(res[1]));
    const optCachedSolves = rawSolvesFlat.map(solveData => parseSolve(String(solveData)));
    const cachedSolves = optCachedSolves.flatMap(solve => solve ? [solve] : []);
    
    return cachedSolves;
}

export const addSolve = async (solve: CachedSolveMeta): Promise<CachedSolveMeta | null> => {
    const redisKey = getRedisKey(solve.teamId);
    const challIdStr = challIdToStr(solve.challId);

    const setResult = await (await cache())
        .pipeline()
        .hget(redisKey, challIdStr)
        .hset(redisKey, { [challIdStr]: JSON.stringify(solve) })
        .exec();
    
    const retRes = setResult?.[0]?.[1];
    if (typeof retRes !== "string" || !retRes) return null;
    return parseSolve(retRes);
};

export const sortBy = (solves: CachedSolveMeta[]) => [...solves].sort((a, b) => a.time - b.time);
