import { CachedChall, ClientSideMeta as ChallCSM } from "cache/challs";
import { CachedUser, ClientSideMeta as UserCSM } from "cache/users";
import { challIdFromStr, teamIdFromStr, userIdFromStr } from "cache/ids";
import { CachedTeamMeta } from "cache/teams";
import { CachedSolveMeta } from "cache/solves";
import { User as DbUser, Team as DbTeam, Chall as DbChall, Solve as DbSolve } from "./types/outgoing.schema";



export const dbToCacheChall = (dbChall: DbChall): CachedChall | null => {
    const {
        id: idStr,
        name, points, description: desc,
        solve_count: solveCount,
        categories, authors, hints, tags,
        links, visible,
    } = dbChall;

    const id = challIdFromStr(idStr);
    if (!id) return null;

    const clientSide: ChallCSM = {
        id, name, points, desc,
        solveCount,

        links,
        categories: categories ?? [],
        authors: authors ?? [],
        hints: hints ?? [],
        tags: tags ?? [],
    };

    const cachedChall: CachedChall = {
        id: id,
        visible,
        clientSideMetadata: clientSide,
    };

    return cachedChall;
};

export const dbToCacheUser = (dbUser: DbUser): CachedUser | null => {
    const {
        id: idStr,
        email, name, score, eligible, admin,
        team_id: teamIdStr, last_solve: lastSolve, 
    } = dbUser;

    const id = userIdFromStr(idStr);
    const teamId = teamIdStr ? teamIdFromStr(teamIdStr) : null;
    if (!id || teamId === undefined) return null;

    const clientSide: UserCSM = {
        userId: id,
        name, score, eligible, admin,
        teamId,
        lastSolve: lastSolve ?? null,
    };

    const cachedUser: CachedUser = {
        userId: id,
        email, eligible, admin, teamId,
        clientSideMetadata: clientSide,
    };

    return cachedUser;
};
export const dbToCacheTeam = (dbTeam: DbTeam): CachedTeamMeta | null => {
    const {
        id: idStr,
        name, score, eligible,
        last_solve: lastSolve, 
        affiliation,
    } = dbTeam;

    const id = teamIdFromStr(idStr);
    if (!id) return null;

    const cachedTeam: CachedTeamMeta = {
        id, name, score, eligible,
        lastSolve: lastSolve ?? null,
        affiliation: affiliation ?? null,
    };

    return cachedTeam;
};

export const dbToCacheSolve = (dbSolve: DbSolve): CachedSolveMeta | null => {
    const {
        chall_id: cidStr, user_id: uidStr, team_id: tidStr,
        correct, counted, time
    } = dbSolve;

    if (!correct || !counted) return null;

    const teamId = teamIdFromStr(tidStr);
    const userId = userIdFromStr(uidStr);
    const challId = challIdFromStr(cidStr);

    if (!teamId || !userId || !challId) return null;

    const cachedSolve: CachedSolveMeta = {
        teamId, userId, challId,
        time,
    };

    return cachedSolve;
};
