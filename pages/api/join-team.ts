import getAccount from "account/validation";
import { getAllTeams } from "cache/teams";
import { syncUser, joinTeam } from "database/users";
import { syncAllTeams } from "database/teams";
import { NextApiHandler } from "next";


const handler: NextApiHandler = async (req, res) =>  {
    {
        const staleAccount = await getAccount({ req });
        if (!staleAccount) {
            res.status(401).send("Not signed in");
            return;
        }
        await syncUser({ id: staleAccount.userId });
        await syncAllTeams();
    }
    const account = await getAccount({ req });
    if (!account) {
        res.status(401).send("Not signed in");
        return;
    }
    if (account.teamId) {
        res.status(403).send("Account already has a team associated");
        return;
    }

    const json = JSON.parse(req.body);
    if (typeof json !== 'object' || json === null) {
        res.status(400).send("Invalid request body");
        return;
    }
    
    const { name, password } = json;
    if (!name || !password) {
        res.status(400).send("name and/or password left undefined");
        return;
    }

    const team = (await getAllTeams()).find(team => team.name === name);

    if (!team) {
        res.status(400).send("This team doesn't exist!");
        return;
    }

    const teamId = team.id;
    const userId = account.userId;
    
    try {
        const success = await joinTeam({ id: userId, auth: { __type: "pass", password }, teamId, teamPassword: password });
        if (success) {
            res.status(200).send("Team successfully joined!");
            return
        } else {
            res.status(403).send("Invalid password!");
            return;
        }
    } catch (e) {
        res.status(500).send("Internal Server Error!");
        return;
    }
};

export default handler;