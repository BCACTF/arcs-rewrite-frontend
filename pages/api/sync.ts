import { NextApiHandler } from "next";
import { timingSafeEqual } from "crypto";
import { webhookToken } from "auth/challenges";
import { syncAllChalls, syncChall } from "database/challs";
import { syncAllTeams, syncTeam } from "database/teams";
import { syncAllUsers, syncUser } from "database/users";
import { syncSolves } from "database/solves";
import { ChallId, TeamId, UserId, challIdFromStr, teamIdFromStr, userIdFromStr, uuidFromStr } from "cache/ids";


enum SyncType {
    ALL,
    SOLVES,

    ALL_CHALLS,
    ALL_TEAMS,
    ALL_USERS,

    CHALL,
    TEAM,
    USER,
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

const uuidIsntAll0s = (uuid: string) => uuid.split("").filter(c => !isNaN(parseInt(c, 16))).every(c => c !== "0");

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

    if (validatedId && uuidIsntAll0s(id)) {
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


const handler: NextApiHandler = async (req, res) =>  {
    console.log("request recieved");

    const authorizationHeaderRaw = req.headers.authorization;
    if (!authorizationHeaderRaw || !authorizationHeaderRaw.startsWith("Bearer ")) {
        console.log("Invalid bearer token:", authorizationHeaderRaw);
        res.statusMessage = "Invalid bearer token";
        res.status(401);
        res.end();
        return;
    }

    const reqBearer = authorizationHeaderRaw.substring("Bearer ".length);
    
    const webhookTokenValue = await webhookToken();

    if (reqBearer.length !== webhookTokenValue.length) {
        console.log("Invalid bearer token:", authorizationHeaderRaw);
        res.statusMessage = "Invalid bearer token";
        res.status(401);
        res.end();
        return;
    }
    
    if (!timingSafeEqual(Buffer.from(reqBearer), Buffer.from(webhookTokenValue))) {
        console.log("Incorrect bearer token:", reqBearer);
        res.statusMessage = "Unauthorized";
        res.status(401);
        res.end();
        return;
    }


    const body = req.body;
    if (!isValidBody(body)) {
        res.status(400);
        res.statusMessage = "Invalid body";
        res.end();
        return;
    }

    
    let syncType = getSyncType(body);

    try {
        const body = req.body as { __type: string, id?: string };

        switch (body.__type) {
            case "all":
                syncType = {
                    __type: SyncType.ALL
                };
                break;
            case "solves":
                syncType = {
                    __type: SyncType.SOLVES
                };
                break;
            case "user":
                if (!body.id) throw new Error("no id provided");
                if (uuidIsntAll0s(body.id)) {
                    const id = userIdFromStr(body.id);
                    if (!id) throw new Error("bad id format");
                    syncType = {
                        __type: SyncType.USER,
                        id,
                    };
                } else {
                    syncType = {
                        __type: SyncType.ALL_USERS,
                    };
                }
                break;
            case "team":
                if (!body.id) throw new Error("no id provided");
                if (uuidIsntAll0s(body.id)) {
                    const id = teamIdFromStr(body.id);
                    if (!id) throw new Error("bad id format");
                    syncType = {
                        __type: SyncType.TEAM,
                        id,
                    };
                } else {
                    syncType = {
                        __type: SyncType.ALL_TEAMS,
                    };
                }
                break;
            case "chall":
                if (!body.id) throw new Error("no id provided");
                if (uuidIsntAll0s(body.id)) {
                    const id = challIdFromStr(body.id);
                    if (!id) throw new Error("bad id format");
                    syncType = {
                        __type: SyncType.CHALL,
                        id,
                    };
                } else {
                    syncType = {
                        __type: SyncType.ALL_CHALLS,
                    };
                }
                break;
            default:
                throw new Error("Unknown sync type");
        }
    } catch (e) {
        res.status(400);
        res.end();
        return;
    }

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

        await Promise.all(awaitablePromises);
        
        res.statusMessage = "Sync Successful";
        res.status(200);
        res.end();
    } catch (e) {
        res.status(500);
        res.end();
    }
};

export default handler;