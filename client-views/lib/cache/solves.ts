import { TeamId, teamIdToStr, teamIdFromStr, UserId, ChallId, userIdFromStr, challIdFromStr, challIdToStr } from "cache/ids";
import cache from "cache/index";

export interface CachedSolveMeta {
    teamId: TeamId;
    userId: UserId;
    challId: ChallId;
    time: number;
}

export const SOLVE_HASH_KEY_PREFIX = "solve:";
const getRedisKey = (teamId: TeamId) => `${SOLVE_HASH_KEY_PREFIX}${teamIdToStr(teamId)}`;

const parseSolve = (solveVal: string): CachedSolveMeta | null => {
    const parsed: unknown = JSON.parse(solveVal);

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
    const time = new Date(timeRaw).getTime() / 1000;
    if (!userId || !teamId || !challId || !time) return null;

    return { userId, teamId, challId, time };
}

export const getSolves = async (id: TeamId): Promise<CachedSolveMeta[]> => {
    const redisKey = getRedisKey(id);
    const rawCachedSolves = await cache.hgetall(redisKey);
    const optCachedSolves = Object.values(rawCachedSolves)
        .map(solveData => parseSolve(solveData));

    return optCachedSolves.flatMap(solve => solve ? [solve] : []);
};

export const addSolve = async (solve: CachedSolveMeta): Promise<CachedSolveMeta | null> => {
    const redisKey = getRedisKey(solve.teamId);
    const challIdStr = challIdToStr(solve.challId);

    const setResult = await cache
        .pipeline()
        .hget(redisKey, challIdStr)
        .hset(redisKey, { [challIdStr]: JSON.stringify(solve) })
        .exec();
    
    const retRes = setResult?.[0]?.[1];
    if (typeof retRes !== "string" || !retRes) return null;
    return parseSolve(retRes);
};
// export const removeOne = async (target: TeamId, chall: ChallId): Promise<boolean> => {
//     const redisKey = getRedisKey(target);

//     return !!await cache.hdel(redisKey, challIdToStr(chall));
// };

export const sortBy = (solves: CachedSolveMeta[]) => [...solves].sort((a, b) => a.time - b.time);
