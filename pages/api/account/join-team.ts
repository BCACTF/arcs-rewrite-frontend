// Types
import { NextApiHandler, NextApiRequest } from "next";

// Utils
import { joinTeam } from "database/users";
import { getAllTeams } from "cache/teams";
import getAccount from "account/validation";


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

const handler: NextApiHandler = async (req, res) =>  {
    if (req.method !== "POST") {
        res.status(400).send("Invalid HTTP method");
    }

    const account = await getAccount({ req });


    if (!account) {
        res.status(401).send("You must be signed in to join a team");
        return;
    }

    const { userId: id, teamId: currTeamId, sub, provider } = account;

    if (currTeamId) {
        res.status(400).send("You already are on a team");
        return;
    }


    const bodyParams = getParams(req);
    console.log(bodyParams);
    if (!bodyParams) {
        res.status(400).send("Incorrect body format");
        return
    }

    const { name, password: teamPassword } = bodyParams;

    const team = (await getAllTeams()).find(team => team.name === name);

    if (!team) {
        res.status(400).send("This team does not exist");
        return;
    }

    const teamId = team.id;


    await joinTeam({
        id, auth: { __type: "oauth", sub, provider },
        teamId, teamPassword,
    });

    res.status(200).send("Successfully created user");
};

export default handler;