import { NextApiHandler } from "next";
import { timingSafeEqual } from "crypto";
import { webhookToken } from "auth/challenges";
import { syncAllChalls, syncChall } from "database/challs";
import { syncAllTeams, syncTeam } from "database/teams";
import { syncAllUsers, syncUser } from "database/users";
import { syncSolves } from "database/solves";
import { ChallId, TeamId, UserId, challIdFromStr, teamIdFromStr, userIdFromStr, uuidFromStr } from "cache/ids";
import { apiLogger, wrapApiEndpoint } from "logging";


enum SyncType {
    ALL = "sync_all",
    SOLVES = "sync_solves",

    ALL_CHALLS = "sync_all_challs",
    ALL_TEAMS = "sync_all_teams",
    ALL_USERS = "sync_all_users",

    CHALL = "sync_one_chall",
    TEAM = "sync_one_team",
    USER = "sync_one_user",
}

type SyncInfo = {
    __type: SyncType.ALL | SyncType.SOLVES | SyncType.ALL_CHALLS | SyncType.ALL_TEAMS | SyncType.ALL_USERS,
} | {
    __type: SyncType.CHALL,
    id: ChallId,
} | {
    __type: SyncType.TEAM,
    id: TeamId,
} | {
    __type: SyncType.USER,
    id: UserId,
};

const isValidBody = (body: unknown): body is { __type: string, id?: string } => {
    try {
        const { __type, id } = body as { __type: string, id?: string };

        if (typeof __type !== "string") return false;
        if (typeof id !== "string" && id !== undefined) return false;

        return true;
    } catch (e) {
        return false;
    }
};

const getSyncType = ({ __type, id }: { __type: string, id?: string }): SyncInfo | null => {
    const validatedId = id && uuidFromStr(id);

    if (validatedId) {
        switch (__type) {
            case "user": {
                const userId = userIdFromStr(id);
                if (!userId) return null;
                else return {
                    __type: SyncType.USER,
                    id: userId
                };
            }
            case "team": {
                const teamId = teamIdFromStr(id);
                if (!teamId) return null;
                else return {
                    __type: SyncType.TEAM,
                    id: teamId
                };
            }
            case "chall": {
                const challId = challIdFromStr(id);
                apiLogger.trace`Chall Id: ${challId}`
                if (!challId) return null;
                else return {
                    __type: SyncType.CHALL,
                    id: challId
                };
            }
            default: return null;
        }
    } else {
        switch (__type) {
            case "all":         return { __type: SyncType.ALL };
            case "solves":      return { __type: SyncType.SOLVES };
            case "all_challs":  return { __type: SyncType.ALL_CHALLS };
            case "all_teams":   return { __type: SyncType.ALL_TEAMS };
            case "all_users":   return { __type: SyncType.ALL_USERS };
            default: return null;
        }
    }
}


const handler: NextApiHandler = wrapApiEndpoint(async (req, res) =>  {
    apiLogger.trace`${req.method} request recieved for ${req.url}`;

    const authorizationHeaderRaw = req.headers.authorization;
    if (!authorizationHeaderRaw || !authorizationHeaderRaw.startsWith("Bearer ")) {
        apiLogger.secWarn`Invalid bearer token: ${authorizationHeaderRaw}`;

        res.statusMessage = "Invalid bearer token";
        res.status(401);
        res.end();
        return;
    }

    const reqBearer = authorizationHeaderRaw.substring("Bearer ".length);
    
    const webhookTokenValue = await webhookToken();

    if (reqBearer.length !== webhookTokenValue.length) {
        apiLogger.secWarn`Invalid bearer token: ${authorizationHeaderRaw.slice(0, 42)}`;
        res.statusMessage = "Invalid bearer token";
        res.status(401);
        res.end();
        return;
    }
    
    if (!timingSafeEqual(Buffer.from(reqBearer), Buffer.from(webhookTokenValue))) {
        apiLogger.secWarn`Invalid bearer token: ${reqBearer}`;

        res.statusMessage = "Unauthorized";
        res.status(401);
        res.end();
        return;
    }


    const body = req.body;
    if (!isValidBody(body)) {
        apiLogger.warn`Invalid request body: ${body}. Make sure you are using \`webhook-rs\`.`;

        res.status(400);
        res.statusMessage = "Invalid body";
        res.end();
        return;
    }

    
    const syncType = getSyncType(body);
    if (!syncType) {
        apiLogger.warn`Requested an invalid sync type ${body.__type}.`;

        res.status(400);
        res.statusMessage = "Invalid sync type";
        res.end();
        return;
    }

    apiLogger.trace`Performing sync of type ${syncType.__type}.`;

    try {
        let promises: ((() => Promise<unknown>) | Promise<unknown>)[];

        switch (syncType.__type) {
            case SyncType.ALL:
                promises = [syncSolves, syncAllChalls, syncAllTeams, syncAllUsers];
                break;
            case SyncType.SOLVES:
                promises = [syncSolves];
                break;
            case SyncType.ALL_CHALLS:
                promises = [syncAllChalls];
                break;
            case SyncType.ALL_TEAMS:
                promises = [syncAllTeams];
                break;
            case SyncType.ALL_USERS:
                promises = [syncAllUsers];
                break;
            case SyncType.CHALL:
                promises = [syncChall({ id: syncType.id })];
                break;
            case SyncType.TEAM:
                promises = [syncTeam({ id: syncType.id })];
                break;
            case SyncType.USER:
                promises = [syncUser({ id: syncType.id })];
                break;
        }

        const awaitablePromises = promises.map(promise => typeof promise === "function" ? promise() : promise);
        
        apiLogger.trace`Beginning ${syncType.__type}...`;
        
        await Promise.all(awaitablePromises);

        apiLogger.info`${syncType.__type} completed successfully!`;
        
        res.statusMessage = "Sync Successful";
        res.status(200);
        res.end();
    } catch (e) {
        apiLogger.warn`${syncType.__type} failed with error ${e}`;

        res.status(500);
        res.end();
    }
});

export default handler;