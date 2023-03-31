import { TeamId, teamIdFromStr, UserId, userIdFromStr, userIdToStr } from "cache/ids";
import cache from "cache/index";

export type UserType = "normal" | "writer" | "admin";

export interface ClientSideMeta {
    name: string;
    userId: UserId;
    teamId: TeamId | null;

    score: number;
    lastSolve: number | null;

    type: UserType;
}

export interface CachedUser {
    userId: UserId;
    email: string;
    
    clientSideMetadata: ClientSideMeta;

    type: UserType;
    
    teamId: TeamId | null;
}


export const USER_HASH_KEY = "user";

const parseUser = (userJson: string): CachedUser | null => {
    const parsed: unknown = JSON.parse(userJson);

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;

    const {
        userId: idRaw,
        email: emailRaw,
        
        type: uTypeRaw,
        teamId: teamIdRaw,

        clientSideMetadata: csmRaw,
    } = parsed as Record<string, unknown>;

    {
        const uId = typeof idRaw === 'string';
        const tId = typeof teamIdRaw === 'string' || teamIdRaw === undefined || teamIdRaw === null;

        const email = typeof emailRaw === 'string';
        const type = typeof uTypeRaw === 'string';
        if (!uId || !tId || !email || !type) return null;
    }

    const userId = userIdFromStr(idRaw);
    const teamId = teamIdRaw ? teamIdFromStr(teamIdRaw) : null;
    const typeValid = uTypeRaw === "normal" || uTypeRaw === "writer" || uTypeRaw === "admin";
    if (!userId || (teamId === undefined) || !typeValid) return null;

    if (typeof csmRaw !== 'object' || csmRaw === null) return null;

    const {
        name: nameRaw,
        score: scoreRaw,
        lastSolve: lastSolveRaw,
    } = csmRaw as Record<string, unknown>;


    {
        const name = typeof nameRaw === 'string';
        const score = typeof scoreRaw === 'number' && Number.isInteger(scoreRaw) && scoreRaw >= 0;
        const lastSolve = typeof lastSolveRaw === 'number' || typeof lastSolveRaw === 'string' || typeof lastSolveRaw === 'undefined';

        if (!name || !score || !lastSolve) return null;
    }

    const name = nameRaw;
    const score = scoreRaw;
    const lastSolve = lastSolveRaw ? new Date(lastSolveRaw).getTime() / 1000 : null;

    const type = uTypeRaw;
    const email = emailRaw;

    const clientSideMetadata: ClientSideMeta = {
        name, score, lastSolve, type, teamId, userId,
    };

    return { userId, teamId, type, email, clientSideMetadata };
}

export const getUsers = async (ids: UserId[]): Promise<CachedUser[]> => {
    const rawCachedUsers = await cache.hmget(USER_HASH_KEY, ...ids.map(userIdToStr));
    const optCachedUsers = rawCachedUsers.flatMap(raw => raw ? [raw] : []).map(parseUser);

    return optCachedUsers.flatMap(user => user ? [user] : []);
};
export const getUsersByTeam = async (teamId: TeamId): Promise<CachedUser[]> => {
    const allUsers = await getAllUsers();

    return allUsers.filter(user => user.teamId === teamId);
};
export const getAllUsers = async (): Promise<CachedUser[]> => {
    const rawCachedUsers = await cache.hvals(USER_HASH_KEY);
    const optCachedUsers = rawCachedUsers.flatMap(raw => raw ? [raw] : []).map(parseUser);

    return optCachedUsers.flatMap(user => user ? [user] : []);
};
const getAllUserKeys = async (): Promise<string[]> => await cache.hkeys(USER_HASH_KEY);

export const getAllUserIds = async (): Promise<UserId[]> => (await cache.hkeys(USER_HASH_KEY))
    .map(userIdFromStr)
    .flatMap(id => id ? [id] : []);

export const update = async (userData: CachedUser): Promise<CachedUser | null> => {
    const userIdStr = userIdToStr(userData.userId);

    const setResult = await cache
        .pipeline()
        .hget(USER_HASH_KEY, userIdToStr(userData.userId))
        .hset(USER_HASH_KEY, { [userIdStr]: JSON.stringify(userData) })
        .exec();
    
    const retRes = setResult?.[0]?.[1];
    if (typeof retRes !== "string" || !retRes) return null;
    return parseUser(retRes);
};
export const removeStale = async (notStale: UserId[]): Promise<UserId[]> => {
    const currSet = new Set(notStale.map(userIdToStr));
    const cachedIds = await getAllUserKeys();
    const removeIds = cachedIds.filter(id => !currSet.has(id));
    if (removeIds.length) await cache.hdel(USER_HASH_KEY, ...removeIds);

    return removeIds.map(userIdFromStr).flatMap(id => id ? [id] : []);
};

export const sortBy = (teams: CachedUser[]) => [...teams].sort((a, b) => a.clientSideMetadata.score - b.clientSideMetadata.score);

