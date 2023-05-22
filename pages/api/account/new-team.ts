// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import { addNewTeam } from "database/teams";
import { getAllTeams } from "cache/teams";
import getAccount from "account/validation";


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

const handler: NextApiHandler = async (req, res) =>  {
    if (req.method !== "POST") {
        res.status(400).send("Invalid HTTP method");
    }

    const account = await getAccount({ req });


    if (!account) {
        res.status(401).send("You must be signed in to create a team");
        return;
    }

    const { userId: initialUser, teamId: currTeamId } = account;

    if (currTeamId) {
        res.status(400).send("You already are on a team");
        return;
    }

    console.log(req.body);

    const bodyParams = getParams(req);
    console.log(bodyParams);
    if (!bodyParams) {
        res.status(400).send("Incorrect body format");
        return
    }

    const { name, eligible, affiliation, password } = bodyParams;

    const team = (await getAllTeams()).find(team => team.name === name);
    if (team) {
        res.status(400).send("A team with this name already exists");
        return;
    }

    const createdTeam = await addNewTeam({
        name, eligible, affiliation, password, initialUser,
    });

    res.status(200).send(createdTeam?.id);
};

export default handler;