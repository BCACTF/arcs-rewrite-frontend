// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import getAccount from "account/validation";
import { apiLogger, wrapApiEndpoint } from "logging";
import { ChallId, challIdFromStr, fmtLogU } from "cache/ids";
import pollDeploy from "admin/poll";


interface PollDeployParams {
    id: ChallId;
}

const getParams = (req: NextApiRequest): PollDeployParams | null => {
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


    const queryParams = getParams(req);
    if (!queryParams) {
        apiLogger.warn`Badly formatted query: ${JSON.stringify(req.query)}`;
        res.status(400).send("Incorrect query format");
        return
    }

    const { id } = queryParams;

    try {
        const status = await pollDeploy(id);
        apiLogger.info`Succeeded in polling deploy server`;
        res.status(200).json(status);
    } catch (e) {
        apiLogger.info`Failed in polling deploy server`;
        res.status(500).send("Failed to poll server");
    }
});

export default handler;