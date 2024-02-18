
// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import getAccount from "account/validation";
import { apiLogger, wrapApiEndpoint } from "logging";
import { ChallId, fmtLogU, challIdFromStr, challIdToStr } from "cache/ids";
import { syncAllChalls, syncChall } from "database/challs";
import { decacheAndSyncSolves } from "database/solves";
import makeWebhookDbRequest from "database/makeWebhookReq";
import { syncAllUsers } from "database/users";
import { syncAllTeams } from "database/teams";


interface SyncUserParams {
    id: ChallId;
}

const getParams = (req: NextApiRequest): SyncUserParams | null => {
    try {
        const id = req.query.id;
        if (typeof id !== "string") return null;

        const challId = challIdFromStr(id);
        if (!challId) return null;

        return { id: challId };
    } catch (e) {
        console.error(e);
        return null;
    }
};

const handler: NextApiHandler = wrapApiEndpoint(async (req, res) =>  {
    apiLogger.trace`Recieved ${req.method} request at ${req.url}`;

    if (req.method !== "GET") {
        apiLogger.info`Requested with ${req.method} instead of GET`;
        res.status(400).send("Invalid HTTP method");
        return;
    }

    const account = await getAccount({ req });

    if (!account) {
        apiLogger.secWarn`Admin requests require admin privileges`;
        res.status(401).send("You must be signed in");
        return;
    }

    const userIdLog = fmtLogU(account.userId);

    apiLogger.debug`Request identified as from user ${account.clientSideMetadata.name} (${userIdLog})`;
    if (!account.admin) {
        apiLogger.secWarn`Admin requests require admin privileges`;
        res.status(403).send("You are not an admin");
        return;
    }
    
    const params = getParams(req);
    if (!params) {
        apiLogger.warn`Badly formatted query: ${JSON.stringify(req.query)}`;
        res.status(400).send("Incorrect query format");
        return;
    }

    const { id } = params;

    try {
        await makeWebhookDbRequest("solve_arr", {
            __type: "solve",
            details: {
                __query_name: "clear_all_chall",
                params: { id: challIdToStr(id) },
            }
        });
        await decacheAndSyncSolves();
        await syncAllChalls();
        await syncAllTeams();
        await syncAllUsers();
        res.status(200).send("Success");
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
});

export default handler;
