// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import getAccount from "account/validation";
import { apiLogger, wrapApiEndpoint } from "logging";
import { TeamId, fmtLogU, teamIdFromStr } from "cache/ids";
import { syncAllTeams, syncTeam } from "database/teams";


interface SyncTeamParams {
    id: TeamId | null;
}

const getParams = (req: NextApiRequest): SyncTeamParams | null => {
    try {
        const id = req.query.id;
        if (typeof id !== "string" && id !== undefined) return null;
        if (id) {
            const teamId = teamIdFromStr(id);
    
            if (!teamId) return null;
    
            return { id: teamId };
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

    const teamIdLog = fmtLogU(account.userId);

    apiLogger.debug`Request identified as from user ${account.clientSideMetadata.name} (${teamIdLog})`;
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
        const syncRes = await syncTeam({ id });
        if (syncRes) {
            res.status(200).send("Success");
        } else {
            res.status(400).send("Failed");
        }
    } else {
        const syncRes = await syncAllTeams();
        if (syncRes) {
            res.status(200).send("Success");
        } else {
            res.status(400).send("Failed");
        }
    }
});

export default handler;
