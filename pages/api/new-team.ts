import getAccount from "account/validation";
import { syncUser } from "database/users";
import { addNewTeam } from "database/teams";
import { NextApiHandler } from "next";


const handler: NextApiHandler = async (req, res) =>  {
    const staleAccount = await getAccount({ req });
    {
        if (!staleAccount) {
            res.status(401).send("Not signed in");
            return;
        }
        await syncUser({ id: staleAccount.userId });
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

    const { name, password, affiliation } = json;
    if (!name || !password) {
        res.status(400).send("name and/or password left undefined");
        return;
    }

    const eligible = account.eligible;
    const initialUser = account.userId;
    
    await addNewTeam({ name, eligible, affiliation, initialUser, password });

    res.status(200).send("Success!");
};

export default handler;