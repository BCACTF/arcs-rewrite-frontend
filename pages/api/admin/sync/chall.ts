// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import getAccount from "account/validation";
import { apiLogger, wrapApiEndpoint } from "logging";
import { ChallId, fmtLogU, challIdFromStr } from "cache/ids";
import { syncAllChalls, syncChall } from "database/challs";


interface SyncUserParams {
    id: ChallId | null;
}

const getParams = (req: NextApiRequest): SyncUserParams | null => {
    try {
        const id = req.query.id;
        if (typeof id !== "string" && id !== undefined) return null;
        if (id) {
            const challId = challIdFromStr(id);
    
            if (!challId) return null;
    
            return { id: challId };
        } else {
            return { id: null };
        }
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

    if (id) {
        const syncRes = await syncChall({ id });
        if (syncRes) {
            res.status(200).send("Success");
        } else {
            res.status(400).send("Failed");
        }
    } else {
        const syncRes = await syncAllChalls();
        if (syncRes) {
            res.status(200).send("Success");
        } else {
            res.status(400).send("Failed");
        }
    }
});

export default handler;
