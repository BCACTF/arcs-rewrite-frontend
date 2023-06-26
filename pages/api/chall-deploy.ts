import { NextApiHandler } from "next";
import { timingSafeEqual } from "crypto";
import { webhookToken } from "auth/challenges";
import { syncAllChalls, syncChall } from "database/challs";
import { challIdFromStr } from "cache/ids";
import { wrapApiEndpoint, apiLogger } from "logging";
import { syncAllTeams } from "database/teams";
import { syncAllUsers } from "database/users";
import { syncSolves } from "database/solves";

/**
 * @deprecated This functionality has been moved to 
 */
const handler: NextApiHandler = wrapApiEndpoint(async (req, res) =>  {
    apiLogger.trace`${req.method} request recieved for ${req.url}`;
    apiLogger.warn`This endpoint is deprecated and may be removed. Please the /api/sync endpoint with the new format.`;

    const authorizationHeaderRaw = req.headers.authorization;
    if (!authorizationHeaderRaw || !authorizationHeaderRaw.startsWith("Bearer ")) {
        apiLogger.secWarn`Request had invalid bearer token ${authorizationHeaderRaw}`;
        res.statusMessage = "Invalid bearer token";
        res.status(401);
        res.end();
        return;
    }

    const reqBearer = authorizationHeaderRaw.substring("Bearer ".length);
    
    const webhookTokenValue = await webhookToken();

    if (reqBearer.length !== webhookTokenValue.length) {
        apiLogger.secWarn`Request had invalid bearer token ${authorizationHeaderRaw}`;
        res.statusMessage = "Invalid bearer token";
        res.status(401);
        res.end();
        return;
    }
    
    if (!timingSafeEqual(Buffer.from(reqBearer), Buffer.from(webhookTokenValue))) {
        apiLogger.secWarn`Request had unknown bearer token ${authorizationHeaderRaw}. (Unauthorized access.)`;
        res.statusMessage = "Unauthorized";
        res.status(401);
        res.end();
        return;
    }
    
    try {
        // TODO --> Do something with poll_id once admin panel is done
        const { chall_id, poll_id } = req.body as { chall_id: unknown, poll_id: unknown };        
        if (typeof chall_id !== "string") throw "chall_id";
        if (typeof poll_id !== "string") throw "poll_id";

        apiLogger.debug`Deploy info: ${{ chall_id, poll_id }}`;
        
        const id = challIdFromStr(chall_id);
        if (!id) throw "chall_id";
        
        
        const chall = await syncChall({ id });
        
        apiLogger.debug`Challenge ${chall}`;
        
        res.statusMessage = "Challenge successfully synced";


        res.status(200);
        res.send("{}");
    } catch (e) {
        apiLogger.error`Invalid payload or network error ${String(e).slice(0, 16)}.`;
        apiLogger.debug`Payload ${req.body}.`;

        res.statusMessage = "Invalid payload";
        res.status(400);
        res.end();
    } finally {
        await Promise.all([
            syncAllChalls(),
            syncAllTeams(),
            syncAllUsers(),
            syncSolves(),
        ])
    }
});

export default handler;