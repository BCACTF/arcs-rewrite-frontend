import getAccount from "account/validation";
import { addNewUser, updateUserFromDb } from "database/users";
import { addNewTeam, hashPassword } from "database/teams";
import { NextApiHandler } from "next";


const handler: NextApiHandler = async (req, res) =>  {
    {
        const staleAccount = await getAccount({ req });
        if (!staleAccount) {
            res.status(401).send("Not signed in");
            return;
        }
        await updateUserFromDb({ id: staleAccount.userId });
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

    const eligible = account.type === "eligible";
    const initialUser = account.userId;
    
    await addNewTeam({ name, description: "", eligible, affiliation, initialUser, password });

    res.status(200).send("Success!");
};

export default handler;