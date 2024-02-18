// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import getAccount from "account/validation";
import { apiLogger, wrapApiEndpoint } from "logging";
import { ChallId, challIdFromStr, fmtLogU } from "cache/ids";
import getAllChallsInRepository from "admin/all-challs";
import { getAllChallenges } from "cache/challs";

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


    try {
        const [allChalls, deployedChalls] = await Promise.all([
            await getAllChallsInRepository(),
            getAllChallenges().then(arr => arr.map(c => c.sourceFolder)).then(arr => new Set(arr)),
        ]);
    
        const undeployedChalls = allChalls.filter(chall => !deployedChalls.has(chall));

        apiLogger.info`Succeeded in getting undeployed challenges`;
        res.status(200).json(undeployedChalls);
    } catch (e) {
        apiLogger.info`Failed in getting undeployed challenges: ${e}`;
        res.status(500).send("Failed to poll server");
    }
});

export default handler;
