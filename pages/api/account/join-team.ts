// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import { joinTeam } from "database/users";
import { getAllTeams } from "cache/teams";
import getAccount from "account/validation";
import { apiLogger, wrapApiEndpoint } from "logging";
import { fmtLogT, fmtLogU } from "cache/ids";


interface JoinTeamApiParams {
    name: string;
    password: string;
}

const getParams = (req: NextApiRequest): JoinTeamApiParams | null => {
    try {
        const body: unknown = JSON.parse(req.body);
        if (typeof body !== "object" || body === null) return null;
        if (Array.isArray(body) || typeof body === "function") return null;
    
        const { name, password } = body as Record<string, unknown>;

        if (typeof name !== "string") return null;
        if (typeof password !== "string") return null;
        
        return { name, password };
    } catch (e) {
        console.error(e);
        return null;
    }
};

const handler: NextApiHandler = wrapApiEndpoint(async (req, res) =>  {
    apiLogger.trace`Recieved ${req.method} request at ${req.url}`;

    if (req.method !== "POST") {
        apiLogger.info`Requested with ${req.method} instead of POST`;
        res.status(400).send("Invalid HTTP method");
        return;
    }

    const account = await getAccount({ req });

    if (!account) {
        apiLogger.info`Team request failed because user was not signed in`;
        res.status(401).send("You must be signed in to join a team");
        return;
    }

    const userIdLog = fmtLogU(account.userId);

    apiLogger.debug`Request identified as from user ${account.clientSideMetadata.name} (${userIdLog})`;

    const { userId: id, teamId: currTeamId, sub, provider } = account;



    if (currTeamId) {
        apiLogger.info`User ${userIdLog} already on team ${currTeamId}`;

        res.status(400).send("You already are on a team");
        return;
    }


    const bodyParams = getParams(req);
    //console.log(bodyParams);
    if (!bodyParams) {
        apiLogger.info`Badly formatted body: ${req.body}`;
        res.status(400).send("Incorrect body format");
        return
    }

    const { name, password: teamPassword } = bodyParams;

    const team = (await getAllTeams()).find(team => team.name === name);

    if (!team) {
        apiLogger.info`Team ${name} does not exist`;
        res.status(400).send("This team does not exist");
        return;
    }

    const teamId = team.id;
    const teamIdLog = fmtLogT(teamId);
    apiLogger.debug`User ${userIdLog} is requesting to join team ${name} (${teamIdLog})`;

    const user = await joinTeam({
        id, auth: { __type: "oauth", sub, provider },
        teamId, teamPassword,
    });

    apiLogger.info`${user ? 'Succeeded' : 'Failed'} in joining team`;

    if (user) res.status(200).send("Successfully created user");
    else res.status(403).send("Team auth failed");
});

export default handler;