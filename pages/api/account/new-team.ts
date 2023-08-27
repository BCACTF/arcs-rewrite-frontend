// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import { addNewTeam, checkTeamnameAvailable } from "database/teams";
import { getAllTeams } from "cache/teams";
import getAccount from "account/validation";
import getTeamnameIssue from "utils/teamname";

import { apiLogger, wrapApiEndpoint } from "logging";
import { fmtLogT, fmtLogU } from "cache/ids";



interface CreateTeamApiParams {
    name: string;
    eligible: boolean;
    affiliation: string | null;
    password: string;
}

const getParams = (req: NextApiRequest): CreateTeamApiParams | null => {
    try {
        const body: unknown = JSON.parse(req.body);

        if (typeof body !== "object" || body === null) return null;
        if (Array.isArray(body) || typeof body === "function") return null;
    
        const { name, eligible, affiliation, password } = body as Record<string, unknown>;

        if (typeof name !== "string") return null;
        if (typeof eligible !== "boolean") return null;
        if (typeof affiliation !== "string" && affiliation !== null) return null;
        if (typeof password !== "string") return null;
        
        return { name, eligible, affiliation, password };
    } catch (e) {
        console.error(e);
        return null;
    }
};

const handler: NextApiHandler = wrapApiEndpoint(async function newTeam(req, res) {
    apiLogger.trace`Recieved ${req.method} request for ${req.url}.`;

    if (req.method !== "POST") {
        apiLogger.warn`Recieved invalid req method.`;
        res.status(400).send("Invalid HTTP method");
        return;
    }

    const account = await getAccount({ req });

    if (!account) {
        apiLogger.warn`Recieved request from a non-signed-in user.`;
        res.status(401).send("You must be signed in to create a team");
        return;
    }

    const { userId: initialUser, teamId: currTeamId } = account;

    apiLogger.debug`Request recieved to create team from ${fmtLogU(initialUser)}.`;
    
    if (currTeamId) {
        apiLogger.warn`Recieved request from a user with a team.`;
        res.status(400).send("You already are on a team");
        return;
    }
    
    // apiLogger.debug`Req body: ${req.body}.`;

    const bodyParams = getParams(req);
    if (!bodyParams) {
        apiLogger.debug`Request body deemed invalid.`;
        res.status(400).send("Incorrect body format");
        return
    }
    
    const { name, eligible, affiliation, password } = bodyParams;
    
    apiLogger.debug`Request was to create team ${name}.`;
    
    if (getTeamnameIssue(name)) {
        apiLogger.warn`Invalid team name ${name}.`;
        res.status(400).send("Invalid team name");
        return
    }
    
    const nameInUse = !(await Promise.all([
        //getAllTeams().then(teams => teams.find(team => team.name !== name)),
        checkTeamnameAvailable({ name }),
    ])).every(Boolean);
    
    
    if (nameInUse) {
        apiLogger.warn`Team name ${name} in use.`;
        res.status(400).send("A team with this name already exists");
        return;
    }
    
    const createdTeam = await addNewTeam({
        name, eligible, affiliation, password, initialUser,
    });

    if (!createdTeam) {
        apiLogger.error`Failed to create team. Check webhook & frontend logs for information.`;
        res.status(500).send("Failed to create team");
        return;
    }

    apiLogger.info`Created team ${createdTeam.name} ${fmtLogT(createdTeam.id)} with initial user ${fmtLogU(initialUser)}.`;
    
    res.status(200).send(createdTeam.id);
});

export default handler;
