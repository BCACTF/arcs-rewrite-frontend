import { CachedChall, ClientSideMeta as ChallCSM } from "cache/challs";
import { CachedUser, ClientSideMeta as UserCSM } from "cache/users";
import { challIdFromStr, teamIdFromStr, userIdFromStr } from "cache/ids";
import { CachedTeamMeta } from "cache/teams";
import { CachedSolveMeta } from "cache/solves";


/**
 * NOTE: **Challenges**
 */
export type DbChallengeMeta = {
    id: string;
    
    name: string;
    description: string;
    points: number;

    authors: string[] | null;
    hints: string[] | null;
    categories: string[] | null;
    tags: string[] | null;
    links: {
        nc: string[];
        web: string[];
        admin: string[];
        static: string[];
    };

    solve_count: number;
    visible: boolean;
    source_folder: string;
};
export const dbToCacheChall = (dbChall: DbChallengeMeta): CachedChall | null => {
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

/**
 * NOTE: **Users**
 */

export type DbUserMeta = {
    id: string;
    email: string;
    name: string;
    team_id: string | null;
    score: number;
    last_solve: number | null;
    eligible: boolean;
    admin: boolean;
};
export const dbToCacheUser = (dbUser: DbUserMeta): CachedUser | null => {
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
        teamId, lastSolve,
    };

    const cachedUser: CachedUser = {
        userId: id,
        email, eligible, admin, teamId,
        clientSideMetadata: clientSide,
    };

    return cachedUser;
};


/**
 * NOTE: **Team**
 */

export type DbTeamMeta = {
    id: string;
    name: string;
    description: string;
    score: number;
    last_solve: number | null;
    last_tiebreaker_solve: number | null;
    eligible: boolean;
    affiliation: string | null;
};

export const dbToCacheTeam = (dbTeam: DbTeamMeta): CachedTeamMeta | null => {
    const {
        id: idStr,
        name, score, eligible,
        last_solve: lastSolve, 
        last_tiebreaker_solve: lastTiebreakerSolve,
        affiliation,
    } = dbTeam;

    const id = teamIdFromStr(idStr);
    if (!id) return null;

    const cachedTeam: CachedTeamMeta = {
        id, name, score, lastSolve, lastTiebreakerSolve, eligible, affiliation
    };

    return cachedTeam;
};



/**
 * NOTE: **Solve**
 */

export type DbSolveMeta = {
    id: string;

    challenge_id: string;
    user_id: string;
    team_id: string;

    correct: boolean;
    counted: boolean;

    timestamp: number;
};


export const dbToCacheSolve = (dbSolve: DbSolveMeta): CachedSolveMeta | null => {
    const {
        challenge_id: cidStr, user_id: uidStr, team_id: tidStr,
        correct, counted, timestamp
    } = dbSolve;

    if (!correct || !counted) return null;

    const teamId = teamIdFromStr(tidStr);
    const userId = userIdFromStr(uidStr);
    const challId = challIdFromStr(cidStr);

    if (!teamId || !userId || !challId) return null;

    const cachedSolve: CachedSolveMeta = {
        teamId, userId, challId,
        time: timestamp,
    };

    return cachedSolve;
};
